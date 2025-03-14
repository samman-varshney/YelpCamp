const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const catchAsync = require("./utility/CatchAsync")
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('connected to  database successfully.');
    })
    .catch(err => {
        console.log("Database connection failed");
        console.log(err);
    })
const Campground = require(path.join(__dirname, "/models/campground.js"));

// camp.save()
//     .then((data) => {
//         console.log('saved to database');
//         console.log(data);
//     }).catch(err => {
//         console.log("Couldn't saved to daatbase");
//         console.log(err);
//     })
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use('/css', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use(express.urlencoded({ extended: true }));
//_method is just a query string you can change it to anything you want 
app.use(methodOverride('_method'));
app.get('/', (req, res) => {
    res.render('home');
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/campgroundedit', { camp });
})
app.patch('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const re = await Campground.findByIdAndUpdate(req.params.id, req.body.campground, { new: true })
    console.log(re);
    res.redirect(`/campgrounds/${re._id}/show`);
}));
// here the task of new is to return the newly updated doc by default it return the doc before updateion so to  new updated onr we use new:true.
app.post('/campgrounds/new', catchAsync(async (req, res) => {
    const re = await new Campground(req.body.campground).save();
    console.log(re);
    res.redirect(`/campgrounds/${re._id}/show`);
}))
app.delete('/campgrounds/:id/delete', async (req, res) => {
    const re = await Campground.findByIdAndDelete(req.params.id);
    console.log(re);
    res.redirect('/campgrounds');
})
app.get('/campgrounds/new', async (req, res) => {
    res.render("campgrounds/addcampground");
})
app.get('/campgrounds/:id/show', async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { camp });
})
app.use((err, req, res, next) => {
    res.send("haan bhai bahut masti chad rhi hai tujje utaru abhi sari masti.")
})
app.listen(3000, () => {
    console.log('Serving at port 3000....');
})

