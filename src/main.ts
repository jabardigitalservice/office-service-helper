import config from './config/config'
import Logger from './pkg/logger'
import Redis from './pkg/redis'
import Http from './transport/http/http'
import PdfGenerations from './internal/pdf-generations/pdf-generations'
import puppeteer from 'puppeteer'
import Footers from './internal/footers/footers'

const main = async () => {
    const { logger } = new Logger(config)
    const redis = new Redis(config, logger)
    const http = new Http(logger, config)
    const browser = await puppeteer.launch({ headless: true })

    // Load internal apps
    new Footers(http, logger, config)
    await PdfGenerations.build(http, logger, config, browser)

    if (config.app.env !== 'test') {
        http.Run(config.app.port.http)
    }

    return {
        http,
    }
}

export default main()
