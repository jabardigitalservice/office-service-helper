import dotenv from 'dotenv'
import { Config } from './config.interface'
import configValidate from './config.validate'

dotenv.config()

const env = configValidate(process.env)

const config: Config = {
    app: {
        name: env.APP_NAME,
        env: env.APP_ENV,
        port: {
            http: env.APP_PORT_HTTP,
        },
        log: env.APP_LOG,
        locale: env.APP_LOCALE,
    },
    jwt: {
        access_key: env.JWT_ACCESS_SECRET,
        algorithm: env.JWT_ALGORITHM,
    },
    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        ttl: env.REDIS_TTL,
    },
    pdf_service: {
        url: env.PDF_SERVICE_URL,
    },
    esign_service: {
        auth: env.ESIGN_SERVICE_AUTH,
        cookies: env.ESIGN_SERVICE_COOKIES,
        nik: env.ESIGN_SERVICE_NIK,
        url: env.ESIGN_SERVICE_URL,
    },
}

export default config
