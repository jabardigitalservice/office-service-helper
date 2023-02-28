import fs from 'fs'
import { AxiosRequestConfig } from 'axios'
import winston from 'winston'
import FormData from 'form-data'
import { SignInput } from '../entity/interface'
import HttpClient from '../../../helpers/http-client'
import { Config } from '../../../config/config.interface'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import lang from '../../../pkg/lang'
import MinioClient from '../../../external/storage/minio'
import createFileObject from '../../../helpers/createFileObject'
import { randomUUID } from 'crypto'

class Usecase {
    private minioClient: MinioClient
    private gatewayService: HttpClient
    private gatewayServiceConfig: AxiosRequestConfig

    constructor(private config: Config, private logger: winston.Logger) {
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
        const originalFilePath = await this.getOriginalFile(body.fileObjectKey)
        if (!fs.existsSync(originalFilePath)) {
            throw new error(
                statusCode.BAD_REQUEST,
                lang.__('common.file.not.found', { attribute: 'PDF' })
            )
        }

        const originalFile = fs.readFileSync(originalFilePath)

        const generatedFooterFile = await this.addFooterPdf(
            body.footers,
            originalFile,
            originalFilePath
        )

        // @TODO: Add Esign (BSRE) API HERE

        return generatedFooterFile
    }

    private async getOriginalFile(fileObjectKey: string) {
        const filePath = `./tmp/${fileObjectKey}`

        await this.minioClient.minio.fGetObject(
            this.config.minio.bucketName,
            fileObjectKey,
            filePath
        )

        return filePath
    }

    private async addFooterPdf(
        body: SignInput['footers'],
        originalFile: Buffer,
        originalFilePath: string
    ) {
        const formData = new FormData()
        const originalFileName = randomUUID()

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

            // Remove original file
            fs.unlinkSync(originalFilePath)

            return generatedFooterFile
        } catch (err: any) {
            // Remove original file
            fs.unlinkSync(originalFilePath)

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
