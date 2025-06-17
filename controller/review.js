const Campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require('../utility/CatchAsync')
const ExpressError = require('../utility/ExpressError');


module.exports.new = catchAsync(async (req, res) => {

    const camp = await Campground.findById(req.params.id);
    if (!camp) {
        return next(new ExpressError('Campground not found', 404));
    }
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    camp.reviews.push(review);

    camp.rating.totalStars += review.rating;
    camp.rating.totalReviews += 1;

    await review.save();
    await camp.save();
    console.log("Review added successfully");
    req.flash('success', 'Review added successfully');
    res.redirect(`/campgrounds/${camp._id}/show`);

})

module.exports.delete = catchAsync( async (req, res)=>{
    console.log('deleting the review')
    const {id, review_id} = req.params;
   
    const camp = await Campground.findById(id);

    if (!camp) {
        return next(new ExpressError('Campground not found', 404));
    }

    const review = await Review.findById(review_id);

    if (!review) {
        return next(new ExpressError('Review not found', 404));
    }

    camp.reviews.pull(review);
    console.log('pulled')
    
    camp.rating.totalStars -= review.rating;
    camp.rating.totalReviews -= 1;

    await camp.save();
    console.log('camp saved')
    await Review.findByIdAndDelete(review_id);
    console.log('review deleted')
    req.flash('success', 'Review has been deleted');
    res.redirect(`/campgrounds/${camp._id}/show`);
})