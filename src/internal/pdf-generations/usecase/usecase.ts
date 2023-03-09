import { Browser } from 'puppeteer'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import PDFMerger from 'pdf-merger-js'
import MinioClient from '../../../external/storage/minio'
import { Config } from '../../../config/config.interface'
import { GeneratedPdf } from '../entity/type'
class PdfGenerateUsecase {
    private minioClient: MinioClient
    private merger: PDFMerger
    constructor(private browser: Browser, private config: Config) {
        this.minioClient = new MinioClient(config)
        this.merger = new PDFMerger()
    }

    private bucketName = this.config.minio.bucketName

    public async GeneratePdf(
        url: string,
        attachments: string[]
    ): Promise<GeneratedPdf> {
        try {
            const page = await this.browser.newPage()

            // document page
            await page.goto(url, {
                waitUntil: 'networkidle2',
            })

            const documentPdf = await page.pdf({ format: 'A4' })

            return {
                documentPdf,
                attachments,
            }
        } catch (err) {
            throw new error(statusCode.BAD_REQUEST, JSON.stringify(err))
        }
    }

    public async mergePdf(generatedPdf: GeneratedPdf): Promise<Buffer> {
        try {

            await this.merger.add(generatedPdf.documentPdf)
            // null attachments
            if(generatedPdf.attachments.length == 0) {
                const documentOnly = await this.merger.saveAsBuffer()
                return documentOnly
            }
            // attachment page (external drafting)
            const attachments = await this.getAttachments(generatedPdf.attachments)
            // iterate the attachments to merge with document
            for (const buffer of attachments) {
                await this.merger.add(buffer)
            }
            const merged = await this.merger.saveAsBuffer()
            return merged
        } catch (err) {
            throw new error(statusCode.BAD_REQUEST, JSON.stringify(err))
        }
    }

    public async getObjectAsBuffer(fileName: string): Promise<Buffer> {
        const attachmentStream = await this.minioClient.minio.getObject(
            this.bucketName,
            fileName
        )
        const chunks = []
        for await (const chunk of attachmentStream) {
            chunks.push(chunk)
        }

        return Buffer.concat(chunks)

    }

    public async getAttachments(attachments: string[]): Promise<Buffer[]> {
        const attachmentsBuffer = []
        for (const attachmentName of attachments) {
            const buffer = await this.getObjectAsBuffer(attachmentName)
            attachmentsBuffer.push(buffer)
        }
        return attachmentsBuffer
    }
}

export default PdfGenerateUsecase
