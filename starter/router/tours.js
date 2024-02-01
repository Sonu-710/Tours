const tourController = require('./../controller/tourController');
const express = require('express');
const router = express.Router();

// router.param('id', tourController.checkID);
router
  .route(`/top-5-tours`)
  .get(tourController.addAlias, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
