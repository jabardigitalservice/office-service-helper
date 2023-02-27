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

class Usecase {
    private minioClient: MinioClient

    constructor(private config: Config, private logger: winston.Logger) {
        this.minioClient = new MinioClient(config)
    }

    private async getFile(fileObjectKey: string) {
        const filePath = `./tmp/${fileObjectKey}`

        await this.minioClient.minio.fGetObject(
            this.config.minio.bucketName,
            fileObjectKey,
            filePath
        )

        return filePath
    }

    public async Sign(body: SignInput) {
        const filePath = await this.getFile(body.fileObjectKey)

        const formData = new FormData()
        const originalFile = fs.readFileSync(filePath)

        formData.append('pdf', originalFile, 'original-file.pdf')
        formData.append('qrcode', body.footers.qrcode)
        formData.append('code', body.footers.code)

        if (body.footers.category) {
            formData.append('category', body.footers.category)
        }

        const response = await this.addFooterPdf(formData, filePath)

        // @TODO: Add Esign (BSRE) API HERE

        return response
    }

    private async addFooterPdf(formData: FormData, originalFilePath: string) {
        const pdfService = new HttpClient(this.config.gateway_service.url)
        const pdfServiceconfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: this.config.gateway_service.auth,
            },
            responseType: 'arraybuffer',
        }

        try {
            const response = await pdfService.client.post(
                'pdf/api/add-footer-pdf',
                formData,
                pdfServiceconfig
            )

            const file = response.data

            const { fileName, fileBuffer, metaData } = createFileObject(file)
            await this.minioClient.minio.putObject(
                this.config.minio.bucketName,
                fileName,
                fileBuffer,
                metaData
            )

            // Remove original file
            fs.unlinkSync(originalFilePath)

            const file_url = `${this.config.core_api.url}/files/${fileName}`

            return {
                data: {
                    fileName,
                    file_url,
                },
            }
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
