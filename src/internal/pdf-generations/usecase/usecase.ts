import { BAD_REQUEST } from 'http-status'
import puppeteer, { Browser } from 'puppeteer'
import { Config } from '../../../config/config.interface'
import MinioClient from '../../../external/storage/minio'
import createFileObject from '../../../helpers/createFileObject'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'

class UseCase {
    public minioClient: MinioClient
    constructor(public config: Config, public browser: Browser) {
        this.minioClient = new MinioClient(config)
    }

    public async generatePdf(url: string) {
        try {
            const page = await this.browser.newPage()
            await page.goto(url, {
                waitUntil: 'networkidle2',
            })
            const pdf = await page.pdf({ format: 'A4' })
            await this.browser.close()

            const { fileName, fileBuffer, metaData } = createFileObject(pdf)
            const upload = await this.minioClient.minio.putObject(
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
        } catch (err) {
            return new error(statusCode.BAD_REQUEST, JSON.stringify(err))
        }
    }
}

export default UseCase
