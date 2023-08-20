const express = require('express');
const router = express.Router();
const viewController = require('../controlers/viewController');
const authControler = require('../controlers/authController');
const bookingControler=require("../controlers/bookingController")
// router.use(authControler.isLoggedIn)
router.use(viewController.alerts)
router.get('/',bookingControler.createBookingCheckout,authControler.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug',authControler.isLoggedIn, viewController.getTour);
router.get('/login',authControler.isLoggedIn,viewController.login);
router.get("/account",authControler.protect,viewController.account)
router.get("/my-tours",authControler.protect,viewController.getMyTours)
router.get("/mytours/:alert",authControler.protect,viewController.getMyTours)
router.get("/signup",viewController.signup)
router.post("/submit-user-data",authControler.protect,viewController.submitUserData)
module.exports = router;
