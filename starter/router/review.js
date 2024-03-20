const express = require('express');
const reviewController = require('./../controller/reviewController');
const authController = require('./../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllreviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setUserTour,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);
module.exports = router;
