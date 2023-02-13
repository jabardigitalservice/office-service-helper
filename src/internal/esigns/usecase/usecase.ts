import fs from 'fs'
import { AxiosRequestConfig } from 'axios'
import winston from 'winston'
import FormData from 'form-data'
import { Config } from '../../../config/config.interface'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import { SignInput } from '../entity/interface'
import lang from '../../../pkg/lang'
import HttpClient from '../../../helpers/http-client'

class Usecase {
    constructor(private config: Config, private logger: winston.Logger) {}

    public async Sign(body: SignInput, filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new error(
                statusCode.BAD_REQUEST,
                lang.__('common.file.not.found', { attribute: 'PDF' })
            )
        }

        const formData = new FormData()
        const originalFile = fs.readFileSync('./' + filePath)

        const nik = body.nik ? body.nik : this.config.esign_service.nik

        formData.append('file', originalFile, 'original-file.pdf')
        formData.append('nik', nik)
        formData.append('passphrase', body.passphrase)
        formData.append('tampilan', 'invisible')
        formData.append('image', 'false')

        const esignService = new HttpClient(this.config.esign_service.url)
        const pdfServiceconfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Basic ${this.config.esign_service.auth}`,
                Cookie: `JSESSIONID=${this.config.esign_service.cookies}`,
            },
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
        }

        try {
            const response = await esignService.client.post(
                'api/sign/pdf',
                formData,
                pdfServiceconfig
            )

            const file = response.data.toString('binary')

            const path = `./tmp/signed-files`
            fs.mkdirSync(path, { recursive: true })

            const signedFilePath = `${path}/${Date.now().toString()}-signed.pdf`

            // Store signed file
            fs.writeFileSync(signedFilePath, file, 'binary')

            // Remove original file
            fs.unlinkSync(filePath)

            return signedFilePath
        } catch (e) {
            // Remove original file
            fs.unlinkSync(filePath)

            throw new error(
                statusCode.INTERNAL_SERVER_ERROR,
                lang.__('external.esign.service.error')
            )
        }
    }
}

export default Usecase
