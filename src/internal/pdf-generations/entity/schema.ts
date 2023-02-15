import Joi from 'joi'

export const Generate = Joi.object({
    url: Joi.string().required(),
})
