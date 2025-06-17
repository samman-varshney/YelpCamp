const campgroundSchema = require('../joiSchema/campgroundSchema.js')
const Campground = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../utility/ExpressError.js')
const reviewSchema = require('../joiSchema/reviewSchema.js')
const multer  = require('multer')
const {storage, cloudinary} = require('../cloudinary/index.js');
// console.log(storage)
const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB max per file
        files: 4 // Max 5 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only jpeg, jpg, and png images are allowed!'));
        }
    }
});
const handleUpload = upload.array('images');

module.exports.uploadMiddleware = (req, res, next) => {
    handleUpload(req, res, err => {
        if (err) {
            console.log(err.message);
            req.flash('error', `Upload error:  ${err.message}`);
            return res.redirect('/campgrounds/new');
        }
        next();
    });
};

module.exports.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated())
        return next();
    // console.log(req.originalUrl);
    console.log('isLoggedIn');
    req.session.returnTo = req.originalUrl
    res.redirect('/login');
}
module.exports.storeReturnTo = function (req, res, next){
    console.log('storing return to')
    res.locals.returnTo = req.session.returnTo || '/campgrounds';
    console.log(res.locals.returnTo);
    next();
}

module.exports.validateCampground = async function (req, res, next) {
    console.log("Validating...");

    const { error, value } = campgroundSchema.validate(req.body);

    if (error) {
        console.log("Validation error");

        // ✅ Collect all uploaded file public IDs (Cloudinary filenames)
        const publicIds = req.files?.map(f => f.filename) || [];

        // ✅ Delete images from Cloudinary only if there are any
        if (publicIds.length > 0) {
            try {
                const result = await cloudinary.api.delete_resources(publicIds);
                console.log('Cloudinary delete result:', result);
            } catch (deleteErr) {
                console.error('Error deleting images from Cloudinary:', deleteErr);
            }
        }

        // ✅ Build Joi error message and pass to error handler
        const message = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(message, 400));
    }

    // ✅ If validation passes
    req.body = value
    next();
}

module.exports.isOwner = async function (req, res, next){
    console.log('isOwner')
    const {id} = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Campground does not exist');
        return res.redirect('/campgorunds');
    }
   
    if(!camp.owner.equals(req.user._id)){
        req.flash('error', 'Your not the Owner of this Campground');
        return res.redirect('/campgrounds');
    }
    next();
}
module.exports.isReviewOwner = async function (req, res, next){
    console.log('authorising')
    const {id, review_id} = req.params;
    const review = await Review.findById(review_id);
    if(!review){
        req.flash('error', 'Review does not exist');
        return res.redirect('/campgorunds');
    }
   console.log(req.user, review.owner, review)
    if(!review.owner._id.equals(req.user._id)){
        req.flash('error', 'Your not the Owner of this Review');
        return res.redirect(`/campgrounds/${id}/show`);
    }
    next();
}
module.exports.validateReview = function (req, res, next){
    console.log('validating')
    const { error } = reviewSchema.validate(req.body);
  
    if (error) {
     
        const message = error.details.map(el => el.message).join(', ');
        throw new ExpressError(message, 400);
    }else{
        next();
    }
}


