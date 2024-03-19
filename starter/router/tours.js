const tourController = require('./../controller/tourController');
const authController = require('./../controller/authController');
const reviewController = require('./../controller/reviewController');
const reviewRouter = require('./../router/review');
const express = require('express');
const router = express.Router();

// router.param('id', tourController.checkID);

router.use('/:tourId/review', reviewRouter);

router
  .route(`/top-5-tours`)
  .get(tourController.addAlias, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    tourController.deleteTour,
  );

module.exports = router;
