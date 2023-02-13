import config from './config/config'
import Logger from './pkg/logger'
import Redis from './pkg/redis'
import Http from './transport/http/http'
import Footers from './internal/footers/footers'
import Esigns from './internal/esigns/esigns'

const main = async () => {
    const { logger } = new Logger(config)
    const redis = new Redis(config, logger)
    const http = new Http(logger, config)

    // Load internal apps
    new Footers(http, logger, config)
    new Esigns(http, logger, config)

    if (config.app.env !== 'test') {
        http.Run(config.app.port.http)
    }

    return {
        http,
    }
}

export default main()
