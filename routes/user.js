const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const {storeReturnTo} = require('../middleware/isLoggedIn');
const userController = require('../controller/user')

router.route('/register')
    .get(userController.registerForm)
    .post( userController.register)

router.route('/login')
    .get(userController.loginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.login)

router.get('/logout', userController.logout)

module.exports = router;