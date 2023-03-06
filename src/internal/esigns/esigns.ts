import { Browser } from 'puppeteer'
import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import Handler from './delivery/http/handler'
import Usecase from './usecase/usecase'
import PdfGenerateUsecase from '../pdf-generations/usecase/usecase'

class Esigns {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config,
        private browser: Browser
    ) {
        const pdfGenerateUsecase = new PdfGenerateUsecase(this.browser)
        const usecase = new Usecase(
            this.config,
            this.logger,
            pdfGenerateUsecase
        )

        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger)

        this.http.app.post('/v1/esigns', handler.Sign())
    }
}

export default Esigns
