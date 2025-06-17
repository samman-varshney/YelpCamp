// baseJoi.js
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                // if (process.env.NODE_ENV === 'production' && clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const extendedJoi = BaseJoi.extend(extension);
module.exports = extendedJoi; // ✅ this must be the extended Joi
