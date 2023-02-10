import fs from 'fs'
import { AxiosRequestConfig } from 'axios'
import winston from 'winston'
import FormData from 'form-data'
import { GenerateInput } from '../entity/interface'
import HttpClient from '../../../helpers/http-client'
import { Config } from '../../../config/config.interface'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import lang from '../../../pkg/lang'

class Usecase {
    constructor(private config: Config, private logger: winston.Logger) {}

    public async Generate(body: GenerateInput, filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new error(
                statusCode.BAD_REQUEST,
                lang.__('common.file.not.found', { attribute: 'PDF' })
            )
        }

        const formData = new FormData()
        const originalFile = fs.readFileSync('./' + filePath)

        formData.append('pdf', originalFile, 'original-file.pdf')
        formData.append('qrcode', body.qrcode)
        formData.append('code', body.code)

        if (body.category) {
            formData.append('category', body.category)
        }

        const response = await this.addFooterPdf(formData, filePath)
        return response
    }

    private async addFooterPdf(formData: FormData, originalFilePath: string) {
        const pdfService = new HttpClient(this.config.base_url.pdf_service)
        const pdfServiceconfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
        }

        const response = await pdfService.client.post(
            'add-footer-pdf',
            formData,
            pdfServiceconfig
        )

        const file = response.data.toString('binary')

        const path = `./tmp/generated-files`
        fs.mkdirSync(path, { recursive: true })

        const generatedFilePath = `${path}/${Date.now().toString()}.pdf`

        // Store generated file
        fs.writeFileSync(generatedFilePath, file, 'binary')

        // Remove original file
        fs.unlinkSync(originalFilePath)

        return generatedFilePath
    }
}

export default Usecase
