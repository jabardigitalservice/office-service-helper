import Joi from 'joi'

export const SignInput = Joi.object({
    generate: Joi.object({
        url: Joi.string().required(),
    }).required(),
    footers: Joi.object({
        qrcode: Joi.string().required(),
        category: Joi.number().optional(),
        code: Joi.string().required(),
    }).required(),
    esigns: Joi.object({
        nik: Joi.string().required(),
        passphrase: Joi.string().required(),
    }).required(),
})
