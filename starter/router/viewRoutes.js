const express = require('express');
const viewController = require('../controller/viewsController');
const authController = require('../controller/authController');
const router = express.Router();

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get(`/tour/:slug`, viewController.getTour);
router.get('/login', viewController.getLoginFrom);

module.exports = router;
