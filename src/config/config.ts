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
    minio: {
        endPoint: env.MINIO_ENDPOINT,
        port: env.MINIO_PORT,
        accessKey: env.MINIO_ACCESS_KEY,
        bucketName: env.MINIO_BUCKET_NAME,
        secretKey: env.MINIO_SECRET_KEY,
        useSSL: env.MINIO_USE_SSL,
    },
    core_api: {
        url: env.CORE_API_URL,
    },
}

export default config
