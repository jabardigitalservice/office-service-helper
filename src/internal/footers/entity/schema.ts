import Joi from 'joi'

export const GenerateInput = Joi.object({
    qrcode: Joi.string().required(),
    category: Joi.number().optional(),
    code: Joi.string().required(),
})
