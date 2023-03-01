import { AxiosRequestConfig } from 'axios'
import winston from 'winston'
import FormData from 'form-data'
import { randomUUID } from 'crypto'
import MinioClient from '../../../external/storage/minio'
import PdfGenerateUsecase from '../../pdf-generations/usecase/usecase'
import { SignInput } from '../entity/interface'
import HttpClient from '../../../helpers/http-client'
import { Config } from '../../../config/config.interface'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import lang from '../../../pkg/lang'
import createFileObject from '../../../helpers/createFileObject'

class Usecase {
    private minioClient: MinioClient
    private gatewayService: HttpClient
    private gatewayServiceConfig: AxiosRequestConfig

    constructor(
        private config: Config,
        private logger: winston.Logger,
        private pdfGenerateUsecase: PdfGenerateUsecase
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

    public async Sign(body: SignInput) {
        // Generate PDF
        const generatedPdfFile = await this.pdfGenerateUsecase.GeneratePdf(
            body.generate.url
        )

        // Generate Footer
        const generatedFooterFile = await this.addFooterPdf(
            body.footers,
            generatedPdfFile
        )

        // Sign PDF
        const signedFile = await this.addSignature(
            body.esigns,
            generatedFooterFile
        )

        return signedFile
    }

    private async addSignature(
        body: SignInput['esigns'],
        originalFile: Buffer
    ) {
        const formData = new FormData()
        const originalFileName = randomUUID() + '.pdf'

        formData.append('file', originalFile, originalFileName)
        formData.append('nik', body.nik)
        formData.append('passphrase', body.passphrase)
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

            const file_url = `${this.config.core_api.url}/files/${fileName}`

            return {
                data: {
                    fileName,
                    file_url,
                },
            }
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
