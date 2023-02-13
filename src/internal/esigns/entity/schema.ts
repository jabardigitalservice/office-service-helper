import Joi from 'joi'

export const SignInput = Joi.object({
    nik: Joi.string().optional(),
    passphrase: Joi.string().required(),
})
