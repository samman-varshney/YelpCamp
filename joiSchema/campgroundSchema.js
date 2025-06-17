const Joi = require('./baseJoi');
// console.log('Does Joi.string().escapeHTML exist?', typeof Joi.string().escapeHTML === 'function');

// console.dir(Joi);
const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string()
            .required()
            .escapeHTML()
            .messages({
                'string.base': 'Title must be a text.',
                'string.empty': 'Title is required.',
                'any.required': 'Title is required.'
            }),

            location: Joi.string()
            .required()
            .escapeHTML()
            .messages({
                'string.empty': 'Location is required.',
                'any.required': 'Location is required.'
            }),

            price: Joi.number()
            .required()
            .min(0)
            .messages({
                'number.base': 'Price must be a number.',
                'number.min': 'Price cannot be negative.',
                'any.required': 'Price is required.'
            }),

            // images: Joi.array()
            // .pattern(new RegExp('https?://.+'))
            // .messages({
            //     'string.pattern.base': 'Image url must start with https://.',
            //     'string.empty': 'Image URL is required.',
            //     'any.required': 'Image URL is required.'
            // }),


            description: Joi.string()
            .required()
            .escapeHTML()
            .messages({
                'string.empty': 'Description is required.',
                'any.required': 'Description is required.'
            })
        }).required().messages({
            'Object.base' : 'Campground details are required.'
        }),
        deleteimages: Joi.array()
        
    });

module.exports = campgroundSchema;