import winston from 'winston'
import { Config } from '../../config/config.interface'
import Http from '../../transport/http/http'
import Handler from './delivery/http/handler'
import Usecase from './usecase/usecase'
import UploadFile from '../../helpers/upload-file'

class Footers {
    constructor(
        private http: Http,
        private logger: winston.Logger,
        private config: Config
    ) {
        const usecase = new Usecase(config, logger)

        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(usecase, this.logger)
        const uploadFile = new UploadFile()

        this.http.app.post(
            '/v1/footers',
            uploadFile.Single('pdf'),
            handler.Generate()
        )
    }
}

export default Footers
