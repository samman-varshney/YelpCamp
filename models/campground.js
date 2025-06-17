const mongoose = require('mongoose');
// const { campgroundSchema } = require('../joiSchema/campgroundSchema');
const Review = require('./review.js');
const { number } = require('joi');

// const User = require('./user.js');
// require mongoose is essential as before any other file use it it will first beexecuted separately and to use mongoose freely we need toimport/require it
const ImageSchema = mongoose.Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});
ImageSchema.virtual('show').get(function(){
    return this.url.replace('/upload', '/upload/w_500')
})
const opts = { toJSON: { virtuals: true } };
const CampSchema = mongoose.Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    images: [ImageSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Review'
    }],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    rating:{
        totalStars:{
            type: Number,
            default: 0,
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    }

}, opts)

CampSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 50)}...</p>`
})
CampSchema.virtual('averageRating').get(function () {
    const rating = Math.round(this.rating.totalStars / this.rating.totalReviews);
    return Number.isNaN(rating) ? 0 : rating;
});
CampSchema.post('findOneAndDelete', async (data)=>{
    console.log('deleting')
    if(data){
        await Review.deleteMany({ _id: { $in: data.reviews } });
    }
})

const Campground = mongoose.model('Campground', CampSchema);
module.exports = Campground