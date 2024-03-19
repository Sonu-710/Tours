const express = require('express');
const router = express.Router();
const reviewController=require('./../controller/reviewController')
const authController=require('./../controller/authController')

router
  .route('/')
  .get(reviewController.getAllreviews)
  .post(authController.protect,authController.restrictTo('user'),reviewController.createReview);

module.exports = router;