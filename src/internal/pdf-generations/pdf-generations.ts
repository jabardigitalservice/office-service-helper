import puppeteer, { Browser } from 'puppeteer'
import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import Handler from './delivery/http/handler'
import UseCase from './usecase/usecase'

class PdfGenerations {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        public config: Config,
        public browser: Browser | null
    ) {
        const usecase = new UseCase(config, browser)
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: UseCase) {
        const handler = new Handler(usecase)
        this.http.app.get('/pdf', handler.generatePdf())
    }

    public static async build(
        http: Http,
        logger: winston.Logger,
        config: Config,
        browser: Browser
    ): Promise<PdfGenerations> {
        browser = await puppeteer.launch({ headless: true })
        return new PdfGenerations(http, logger, config, browser)
    }
}

export default PdfGenerations
