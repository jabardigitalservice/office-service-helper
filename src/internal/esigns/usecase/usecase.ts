import { AxiosRequestConfig } from 'axios'
import winston from 'winston'
import FormData from 'form-data'
import { NatsConnection, StringCodec, Subscription } from 'nats'
import { randomUUID } from 'crypto'
import MinioClient from '../../../external/storage/minio'
import PdfGenerateUsecase from '../../pdf-generations/usecase/usecase'
import { ProgressUpdatePayload, SignInput } from '../entity/interface'
import HttpClient from '../../../helpers/http-client'
import { Config } from '../../../config/config.interface'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import lang from '../../../pkg/lang'
import createFileObject from '../../../helpers/createFileObject'
import { EsignProgressUpdateStatus } from '../entity/enums'
import { passphraseDecryption } from '../../../helpers/passphrase-decryption'

class Usecase {
    private minioClient: MinioClient
    private gatewayService: HttpClient
    private gatewayServiceConfig: AxiosRequestConfig

    constructor(
        private config: Config,
        private logger: winston.Logger,
        private pdfGenerateUsecase: PdfGenerateUsecase,
        private nats: NatsConnection
    ) {
        this.minioClient = new MinioClient(config)

        this.gatewayService = new HttpClient(this.config.gateway_service.url)
        this.gatewayServiceConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: this.config.gateway_service.auth,
            },
            responseType: 'arraybuffer',
        }
    }

    public async subscribe() {
        try {
            const subject = this.config.nats.subject.esignProcess
            const queue = this.config.nats.queueName

            const subscribe = this.nats.subscribe(subject, { queue })
            this.logger.info(`listening for ${subject} requests...`)

            await this.handleRequest(queue, subscribe)
        } catch (error: any) {
            this.logger.error(error.message)
        }
    }

    private async handleRequest(name: string, subscribe: Subscription) {
        const sc = StringCodec()

        for await (const message of subscribe) {
            const { data } = JSON.parse(sc.decode(message.data))

            if (data) {
                this.logger.info(
                    `[${name}]: #${subscribe.getProcessed()} handled`
                )

                await this.sign(data)
            }
        }
    }

    private async progressUpdate(data: Partial<ProgressUpdatePayload>) {
        this.nats.publish(
            this.config.nats.subject.esignProgressUpdate,
            StringCodec().encode(JSON.stringify(data))
        )
    }

    private async sign(body: SignInput) {
        await this.progressUpdate({
            id: body.id,
            userId: body.userId,
            status: EsignProgressUpdateStatus.INITIATE,
        })

        try {
            // Generate PDF
            const generatedPdfFile = await this.pdfGenerateUsecase.GeneratePdf(
                body.generate.url
            )

            if (generatedPdfFile) {
                await this.progressUpdate({
                    id: body.id,
                    userId: body.userId,
                    status: EsignProgressUpdateStatus.GENERATE_PDF,
                })
            }

            // Merge PDF
            const mergedPdf = await this.pdfGenerateUsecase.mergePdf(
                generatedPdfFile,
                body.merge.attachments
            )

            if (mergedPdf) {
                await this.progressUpdate({
                    id: body.id,
                    userId: body.userId,
                    status: EsignProgressUpdateStatus.MERGE_PDF,
                })
            }

            // Generate Footer
            const generatedFooterFile = await this.addFooterPdf(
                body.footers,
                mergedPdf
            )

            if (generatedFooterFile) {
                await this.progressUpdate({
                    id: body.id,
                    userId: body.userId,
                    status: EsignProgressUpdateStatus.GENERATE_FOOTER,
                })
            }

            // Sign PDF
            const fileInfo = await this.addSignature(
                body.esigns,
                generatedFooterFile
            )

            if (fileInfo) {
                const progressUpdatePayload: Partial<ProgressUpdatePayload> =
                    Object.assign({}, body)

                progressUpdatePayload.status =
                    EsignProgressUpdateStatus.ADD_SIGNATURE
                progressUpdatePayload.fileInfo = fileInfo

                await this.progressUpdate(progressUpdatePayload)
            }
        } catch (error: any) {
            await this.progressUpdate({
                id: body.id,
                userId: body.userId,
                status: EsignProgressUpdateStatus.ERROR,
                message: error.message,
            })
        }
    }

    private async addSignature(
        body: SignInput['esigns'],
        originalFile: Buffer
    ): Promise<ProgressUpdatePayload['fileInfo']> {
        const formData = new FormData()
        const originalFileName = randomUUID() + '.pdf'

        const passphrase = passphraseDecryption(
            body.passphrase,
            this.config.esign.passphraseEncryptionSecretKey
        )

        formData.append('file', originalFile, originalFileName)
        formData.append('nik', body.nik)
        formData.append('passphrase', passphrase)
        formData.append('tampilan', 'invisible')
        formData.append('image', 'false')

        try {
            const response = await this.gatewayService.client.post(
                'bsre/api/sign/pdf',
                formData,
                this.gatewayServiceConfig
            )

            const file = response.data

            const { fileName, fileBuffer, metaData } = createFileObject(file)
            await this.minioClient.minio.putObject(
                this.config.minio.bucketName,
                fileName,
                fileBuffer,
                metaData
            )

            const fileUrl = `${this.config.core_api.url}/files/${fileName}`

            return { fileName, fileUrl }
        } catch (err: any) {
            if (err.response) {
                throw new error(
                    err.response.status,
                    err.response.data.toString()
                )
            }

            throw new error(
                statusCode.INTERNAL_SERVER_ERROR,
                lang.__('external.esign.service.error')
            )
        }
    }

    private async addFooterPdf(
        body: SignInput['footers'],
        originalFile: Buffer
    ) {
        const formData = new FormData()
        const originalFileName = randomUUID() + '.pdf'

        formData.append('pdf', originalFile, originalFileName)
        formData.append('qrcode', body.qrcode)
        formData.append('code', body.code)

        if (body.category) {
            formData.append('category', body.category)
        }

        try {
            const response = await this.gatewayService.client.post(
                'pdf/api/add-footer-pdf',
                formData,
                this.gatewayServiceConfig
            )

            const generatedFooterFile = response.data

            return generatedFooterFile
        } catch (err: any) {
            if (err.response) {
                throw new error(
                    err.response.status,
                    err.response.data.toString()
                )
            }

            throw new error(
                statusCode.INTERNAL_SERVER_ERROR,
                lang.__('external.pdf.service.error')
            )
        }
    }
}

export default Usecase
