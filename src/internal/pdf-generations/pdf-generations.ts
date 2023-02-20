import { Browser } from 'puppeteer'
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
        public browser: Browser
    ) {
        const usecase = new UseCase(config, browser)

        this.loadHttp(usecase)
    }

    private loadHttp(usecase: UseCase) {
        const handler = new Handler(usecase)
        this.http.app.get('/pdf', handler.generatePdf())
    }
}

export default PdfGenerations
