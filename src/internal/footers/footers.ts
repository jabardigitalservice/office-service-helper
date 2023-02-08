import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import Handler from './delivery/http/handler'
import Usecase from './usecase/usecase'
import { Upload } from '../../helpers/upload'
import multer from 'multer'

class Footers {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config
    ) {
        const usecase = new Usecase(logger)

        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger)
        const verify = this.http.VerifyAuth(this.config.jwt.access_key)

        const upload = multer({ dest: 'tmp/uploads/' })

        this.http.app.post(
            '/v1/footers',
            upload.single('pdf'),
            handler.generate()
        )
    }
}

export default Footers
