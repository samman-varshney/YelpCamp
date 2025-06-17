if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session  = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utility/ExpressError')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const campgroundRoutes = require('./routes/campgrounds.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/user.js');
const User = require('./models/user.js');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongo")(session);
const dbURL = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

// 'mongodb://127.0.0.1:27017/yelp-camp'

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('connected to  database successfully.');
    })
    .catch(err => {
        console.log("Database connection failed");
        console.log(err);
    })



app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
// app.use('/css', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'thisshouldbeasecret';
const store = new MongoDBStore({
    url: 'mongodb://127.0.0.1:27017/yelp-camp',
    secret: secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

app.use(session({
    store,
    name: 'Colectora',
    secret: secret,
    resave: false,
    // secure: true,
    saveUninitialized: true,
    cookie: {
        
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
  }),
);
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
  
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email' },User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    // console.log(req.session);
    // console.log(req.query)
    res.locals.currentUser = req.user;
 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});



app.all('*', (req, res, next) => {
     if (req.originalUrl === '/.well-known/appspecific/com.chrome.devtools.json') {
        return res.status(204).end(); // No Content
    }
    console.log('Catch-all route hit:', req.originalUrl);
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    
    const { status = 500, message = 'Something went wrong'} = err;
    // if (!err.message) err.message = 'Something went wrong';
    // res.status(status).send(`error: ${err.message}`);
    console.log("error occured");
    console.log(status, message);
    console.log(err.stack); 
    res.status(status).render('error', { status, message });

})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});
