// @ts-nocheck
import Joi from "joi";

const email = Joi.string()
    .email({ tlds: { allow: false } })
    .trim()
    .lowercase()
    .required()
    .messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required',
    });

const mobile = Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .trim()
    .required()
    .messages({
        'string.base': 'Mobile must be a string',
        'string.empty': 'Mobile is required',
        'string.pattern.base': 'Mobile must be digits and may start with +, length 10-15',
        'any.required': 'Mobile is required',
    });

const newKycSchema = Joi.object({
    email,
    mobile,
});

export { newKycSchema };
