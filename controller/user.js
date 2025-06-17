const  User = require('../models/user')

module.exports.register = async (req, res)=>{
    try{
    const {username, email, password} = req.body;
    const user = new User({username, email});
    const registeredUser = await User.register(user, password);
     req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}
module.exports.loginForm = (req, res)=>{
    res.render('user/login');
}

module.exports.login = (req, res)=>{
    console.log('logged')
    req.flash('success', 'Your are logged in');
    const backTo = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo;
   
    res.redirect(backTo);
}

module.exports.logout = (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success', 'You are logged out now');
        res.redirect('/campgrounds');
    });
   
}

module.exports.registerForm = (req, res)=>{
    res.render('user/register');
}