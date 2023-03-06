import config from './config/config'
import Logger from './pkg/logger'
import Http from './transport/http/http'
import Esigns from './internal/esigns/esigns'

const main = async () => {
    const { logger } = new Logger(config)
    const http = new Http(logger, config)

    // Load internal apps
    new Esigns(logger, config)

    if (config.app.env !== 'test') {
        http.Run(config.app.port.http)
    }

    return {
        http,
    }
}

export default main()
