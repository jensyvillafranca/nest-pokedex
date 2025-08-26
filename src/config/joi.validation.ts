import * as Joi from 'joi';


export const JoiValidacionEsquema = Joi.object({
    MONGODB:Joi.required(),
    PORT:Joi.number().default(3001),
    DEFAULT_LIMIT:Joi.number().default(6)
})