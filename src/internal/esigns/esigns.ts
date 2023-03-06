import puppeteer from 'puppeteer'
import winston from 'winston'
import { Config } from '../../config/config.interface'
import Usecase from './usecase/usecase'
import PdfGenerateUsecase from '../pdf-generations/usecase/usecase'
import Nats from '../../external/transporters/nats/nats'
class Esigns {
    constructor(private logger: winston.Logger, private config: Config) {
        this.loadUsecase()
    }

    private async loadUsecase() {
        const executablePath =
            this.config.app.env !== 'local'
                ? '/usr/bin/chromium-browser'
                : undefined

        const browser = await puppeteer.launch({
            executablePath,
            args: ['--no-sandbox', '--disable-gpu'],
        })
        const pdfGenerateUsecase = new PdfGenerateUsecase(browser)

        const nats = await new Nats().connect(this.config, this.logger)

        const usecase = new Usecase(
            this.config,
            this.logger,
            pdfGenerateUsecase,
            nats
        )

        await usecase.subscribe()
    }
}

export default Esigns
