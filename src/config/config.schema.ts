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
    REDIS_HOST: Joi.string().optional(),
    REDIS_PORT: Joi.number().optional(),
    REDIS_TTL: Joi.number().optional(),
    PDF_SERVICE_URL: Joi.string().required(),
    ESIGN_SERVICE_AUTH: Joi.string().required(),
    ESIGN_SERVICE_COOKIES: Joi.string().required(),
    ESIGN_SERVICE_NIK: Joi.string().required(),
    ESIGN_SERVICE_URL: Joi.string().required(),
})
