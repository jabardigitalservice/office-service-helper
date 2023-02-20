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
    minio: {
        endPoint: env.MINIO_ENDPOINT,
        port: env.MINIO_PORT,
        accessKey: env.MINIO_ACCESS_KEY,
        bucketName: env.MINIO_BUCKET_NAME,
        secretKey: env.MINIO_SECRET_KEY,
        useSSL: env.MINIO_USE_SSL,
    },
    coreApi: {
        url: env.CORE_API_URL,
    },
    base_url: {
        pdf_service: env.BASE_URL_PDF_SERVICE,
    },
}

export default config
