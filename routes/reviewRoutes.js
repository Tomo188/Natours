const express = require('express')
const router=express.Router({mergeParams:true})
const authControler=require("../controlers/authController")
const reviewController=require("../controlers/reviewsControlers")
router.use(authControler.protect)
 router.route("/").get(reviewController.getAllReviews).post(authControler.restrictTo("user"),reviewController.checkForRevivesAndBooking,reviewController.setUserAndTourId,reviewController.createReview)
router.route("/:id").get(reviewController.getOneReview).delete(authControler.restrictTo("user","admin"),reviewController.deleteOne).patch(authControler.restrictTo("user","admin"),reviewController.updateOne)
module.exports=router