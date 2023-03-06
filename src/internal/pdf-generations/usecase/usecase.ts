import { Browser } from 'puppeteer'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'

class PdfGenerateUsecase {
    constructor(private browser: Browser) {}

    public async GeneratePdf(url: string): Promise<Buffer> {
        try {
            const page = await this.browser.newPage()
            await page.goto(url, {
                waitUntil: 'networkidle2',
            })
            const pdf = await page.pdf({ format: 'A4' })

            return pdf
        } catch (err) {
            throw new error(statusCode.BAD_REQUEST, JSON.stringify(err))
        }
    }
}

export default PdfGenerateUsecase
