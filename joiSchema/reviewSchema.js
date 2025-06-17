const Joi = require('./baseJoi');
// console.log('Does Joi.string().escapeHTML exist?', typeof Joi.string().escapeHTML === 'function');
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating must be at most 5',
      'any.required': 'Rating is required'
    }),
    body: Joi.string().required().escapeHTML().messages({
      'string.empty': 'Review body cannot be empty',
      'any.required': 'Review body is required'
    })
  }).required().messages({
    'any.required': 'Review object is required'
  })
});

module.exports = reviewSchema;