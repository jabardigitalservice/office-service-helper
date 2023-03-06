import Joi from 'joi'

export default Joi.object({
    APP_NAME: Joi.string().required(),
    APP_ENV: Joi.string()
        .valid('local', 'staging', 'production')
        .default('local'),
    APP_PORT_HTTP: Joi.number().required(),
    APP_LOG: Joi.string().valid('info', 'error', 'warn').required(),
    APP_LOCALE: Joi.string().valid('en', 'id').optional(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_ALGORITHM: Joi.string().default('HS256'),
    MINIO_ENDPOINT: Joi.string().required(),
    MINIO_PORT: Joi.number().allow('').optional(),
    MINIO_USE_SSL: Joi.boolean().required(),
    MINIO_ACCESS_KEY: Joi.string().required(),
    MINIO_SECRET_KEY: Joi.string().required(),
    MINIO_BUCKET_NAME: Joi.string().required(),
    CORE_API_URL: Joi.string().required(),
    INTERNAL_GATEWAY_SERVICE_URL: Joi.string().required(),
    INTERNAL_GATEWAY_SERVICE_AUTH: Joi.string().required(),
    NATS_URL: Joi.string().required(),
    NATS_QUEUE_NAME: Joi.string().required(),
    NATS_ESIGN_PROCESS_NAME: Joi.string().required(),
    NATS_ESIGN_PROGRESS_UPDATE_NAME: Joi.string().required(),
})
