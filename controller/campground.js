const catchAsync = require('../utility/catchAsync');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.show = catchAsync(async function (req, res) {
    const camp = await Campground.findById(req.params.id).populate('owner') // populate campground owner
    .populate({
        path: 'reviews',
        populate: {
            path: 'owner', // populate each review's owner
            model: 'User'
            }
    });
    // console.log(camp);
    res.render('campgrounds/show', { camp, currentUser: req.user });
})

module.exports.newForm = function (req, res) {
    res.render("campgrounds/addcampground");
}

module.exports.delete = catchAsync(async function (req, res) {
    const re = await Campground.findByIdAndDelete(req.params.id);
    // console.log(re);
    const publicIds = re.images?.map(img=>(img.filename))||[];
    if(publicIds.length>0){
            await cloudinary.api.delete_resources(publicIds, function(error, result) {
            if (error) {
                console.error('Error deleting images:', error);
            } else {
                console.log('Delete result:', result);
            }
            });
    }
    req.flash('success', 'Campground deleted successfully');
    res.redirect('/campgrounds');
})

module.exports.new = catchAsync(async function (req, res) {

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // const campground = new Campground(req.body.campground);
    // console.log(geoData)
    if(geoData.features.length === 0){
        const publicIds = re.images?.map(img=>(img.filename))||[];
        if(publicIds.length>0){
                await cloudinary.api.delete_resources(publicIds, function(error, result) {
                if (error) {
                    console.error('Error deleting images:', error);
                } else {
                    console.log('Delete result:', result);
                }
                });
        }
        req.flash('error', 'No Valid location found. Please try Again')
        return res.redirect('/campgrounds/new');
    }
    const campground = new Campground(req.body.campground);
    campground.images =  req.files.map(f=>({url: f.path, filename: f.filename}));
    campground.owner = req.user._id;
    campground.geometry = geoData.features[0].geometry;
    await campground.save();
    console.log('new camp saved')
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}/show`)
})

module.exports.edit = catchAsync(async function (req, res) {

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    // const campground = new Campground(req.body.campground);
    
    if(geoData.features.length === 0){
        const publicIds = re.images?.map(img=>(img.filename))||[];
        if(publicIds.length>0){
                await cloudinary.api.delete_resources(publicIds, function(error, result) {
                if (error) {
                    console.error('Error deleting images:', error);
                } else {
                    console.log('Delete result:', result);
                }
                });
        }
        req.flash('error', 'No Valid location found. Please try Again')
        return res.redirect('/campgrounds/new');
    }
    const re = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true })
    re.geometry = geoData.features[0].geometry;
    
    if(req.files && req.files.length > 0){
        const imgs = req.files.map(f=>({url: f.path, filename: f.filename}));
        re.images.push(...imgs);
        re.save();
    }
    // console.log(req.body.deleteimages);
    if (req.body.deleteimages && req.body.deleteimages.length > 0) {
        await cloudinary.api.delete_resources(req.body.deleteimages, function(error, result) {
            if (error) {
                console.error('Error deleting images:', error);
            } else {
                console.log('Delete result:', result);
            }
        });
        await re.updateOne({ $pull: { images: { filename: { $in: req.body.deleteimages } } } });
    }

    req.flash('success', 'Campground updated successfully');
    res.redirect(`/campgrounds/${re._id}/show`);
})

module.exports.editForm = catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/campgroundedit', { camp });
})

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}