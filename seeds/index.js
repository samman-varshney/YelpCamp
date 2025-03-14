const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('connected to  database successfully.');
    })
    .catch(err => {
        console.log("Database connection failed");
        console.log(err);
    })
const Campground = require("../models/campground.js");
const cities = require(path.join(__dirname, 'cities.js'));
const { descriptors, places } = require(path.join(__dirname, "seedHelpers.js"));
const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}
async function seedDb() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        let randoc = Math.floor(Math.random() * 1000);
        let randprice = Math.floor(Math.random() * 10000) + 2000;
        await new Campground({
            location: `${cities[randoc].city} ${cities[randoc].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: " Lorem ipsum dolor sit amet consectetur, a ea hic tempora accusantium perferendis officiis exercitationem ab earum distinctio magnam sapiente nihil blanditiis illum impedit eum aut, consequatur iure? Exercitationem sequi dolores ut recusandae corrupti magnam nesciunt, aliquid suscipit totam debitis laborum, iure tempore.",
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: randprice
        }).save()
        //save return a thenable object not a promise so you can't use catch function with it
    }
}
//async function always return a promise no matter you return it explicitly or not,remaimber it return a promise not a thenable object. 
seedDb().then(
    () => {
        mongoose.connection.close();
    }
)
    .catch(err => { console.log("failed to add data.") })