import Joi from 'joi'

export const SignInput = Joi.object({
    fileObjectKey: Joi.string().required(),
    footers: Joi.object({
        qrcode: Joi.string().required(),
        category: Joi.number().optional(),
        code: Joi.string().required(),
    }),
})