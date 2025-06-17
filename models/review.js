const mongoose  = require('mongoose');
const { Schema } = mongoose;
const reviewSchema = new Schema({
    
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    body: {
        type: String,
        required: true,
        
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, {timestamps: true});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;