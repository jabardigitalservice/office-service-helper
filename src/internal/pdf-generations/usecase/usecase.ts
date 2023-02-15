import { BAD_REQUEST } from 'http-status'
import puppeteer from 'puppeteer'
import { Config } from '../../../config/config.interface'
import MinioClient from '../../../external/storage/minio'
import createFileObject from '../../../helpers/createFileObject'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'

class UseCase {
    public minioClient: MinioClient
    constructor(public config: Config) {
        this.minioClient = new MinioClient(config)
    }

    public async generatePdf(url: string) {
        try {
            const browser = await puppeteer.launch({ headless: true })
            const page = await browser.newPage()
            await page.goto('http://example.com/', {
                waitUntil: 'networkidle0',
            })
            const pdf = await page.pdf({ format: 'A4' })

            await browser.close()

            const { fileName, fileBuffer, metaData } = createFileObject(pdf)
            const upload = await this.minioClient.minio.putObject(
                this.config.minio.bucketName,
                fileName,
                fileBuffer,
                metaData
            )
            
            const file_url = `${this.config.coreApp.url}`

            return {
                data: {
                    fileName,
                    file_url,
                },
            }
        } catch (err) {
            console.log('error1: ', err)
            return new error(statusCode.BAD_REQUEST, JSON.stringify(err))
        }
    }
}

export default UseCase
