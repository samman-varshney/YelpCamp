const mongoose = require('mongoose');
// require mongoose is essential as before any other file use it it will first beexecuted separately and to use mongoose freely we need toimport/require it

const CampSchema = mongoose.Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    image: String
})

const Campground = mongoose.model('Campground', CampSchema);
module.exports = Campground