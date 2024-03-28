const express = require('express');
const viewController = require('../controller/viewsController');
const authController=require('../controller/authController')
const router = express.Router();

router.get('/', viewController.getOverview);
router.get(`/tour/:slug`,authController.protect, viewController.getTour);
router.get('/login',viewController.getLoginFrom);

module.exports = router;
