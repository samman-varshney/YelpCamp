const express = require('express');
const router = express.Router();
const {isLoggedIn, isOwner, validateCampground, uploadMiddleware} = require('../middleware/isLoggedIn.js')
const campgroundController = require('../controller/campground.js')

router.get('/', 
    campgroundController.index)

router.route('/:id/edit')
    .get(isLoggedIn, 
        campgroundController.editForm)
    .patch(isLoggedIn, 
        isOwner,
        uploadMiddleware, 
        validateCampground, 
        campgroundController.edit);

// here the task of new is to return the newly updated doc by default it return the doc before updateion so to  new updated onr we use new:true.
router.route('/new')
    .get(isLoggedIn, 
        campgroundController.newForm)
    .post(isLoggedIn,
        uploadMiddleware, 
        validateCampground, 
        campgroundController.new)
    


router.delete('/:id/delete', 
    isLoggedIn, 
    isOwner, 
    campgroundController.delete)

router.get('/:id/show', 
    campgroundController.show);

module.exports = router;