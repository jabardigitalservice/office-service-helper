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
        url: env.APP_URL,
        log: env.APP_LOG,
        locale: env.APP_LOCALE,
    },
    jwt: {
        access_key: env.JWT_ACCESS_SECRET,
        algorithm: env.JWT_ALGORITHM,
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
    gateway_service: {
        url: env.INTERNAL_GATEWAY_SERVICE_URL,
        auth: env.INTERNAL_GATEWAY_SERVICE_AUTH,
    },
    nats: {
        url: env.NATS_URL,
        queueName: env.NATS_QUEUE_NAME,
        authToken: env.NATS_AUTH_TOKEN,
        subject: {
            esignProcess: env.NATS_ESIGN_PROCESS_NAME,
            esignProgressUpdate: env.NATS_ESIGN_PROGRESS_UPDATE_NAME,
        },
    },
    esign: {
        passphraseEncryptionSecretKey:
            env.ESIGN_PASSPHRASE_ENCRYPTION_SERCERT_KEY,
    },
}

export default config
