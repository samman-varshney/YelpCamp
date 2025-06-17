const express = require('express');
const router = express.Router({ mergeParams: true});
const reviewController = require('../controller/review.js');
const {isLoggedIn, validateReview, isReviewOwner} = require('../middleware/isLoggedIn.js')


router.post('/', isLoggedIn, validateReview, reviewController.new);

router.delete('/:review_id', isLoggedIn, isReviewOwner, reviewController.delete)

module.exports = router;