import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import Handler from './delivery/http/handler'
import Usecase from './usecase/usecase'
import UploadFile from '../../helpers/upload'

class Footers {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config,
        private uploadFile: UploadFile
    ) {
        const usecase = new Usecase(config, logger)

        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger)

        this.http.app.post(
            '/v1/footers',
            this.uploadFile.single('pdf'),
            handler.generate()
        )
    }
}

export default Footers
