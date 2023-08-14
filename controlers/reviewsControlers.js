const sendResponse = require('../helper/sendResponse').sendResponse;
const catchAsync=require("../util/catchAsync");
const Review=require("../models/review_models")
const AppError=require("../util/appError")
const factory=require("./handleFactory")
const checkBooking=require("../helper/booking_checking");
const checkForBookings = require('../helper/booking_checking');
exports.getAllReviews=catchAsync(async function(req,resp,next){
    let filter={}
    if(req.params.tourId) filter={tour:req.params.tourId}
    const reviews=await Review.find(filter)
    sendResponse(req,resp,200,{
        success:true,
        data:{
            reviews
        }
    })
})
exports.getOneReview=catchAsync(async function(req,resp,next){
    const review=await Review.findById(req.params.id)
    if(!review) next(new AppError("review not found",404))
    sendResponse(req,resp,200,{
        success:true,
        data:{
            review
        }
    })
})
exports.createReview=catchAsync(async function(req,resp,next){

    if(!req.body.tour) req.body.tour=req.params.id
    if(!req.body.user) req.body.user=req.user.id
    const reviewNew=await Review.create(req.body)
    sendResponse(req,resp,200,{
        success:true,
        message:"Succesefuly created review",
        data:{
            reviewNew
        }
    }
        )
    
})
exports.checkForRevivesAndBooking=async function(req,resp,next){
    const premision=await checkBooking(req.body.user,req.body.tour)
    if(premision)
    return next()
    next(new AppError("You didn't book this tour",403))
    
}
exports.deleteOne=factory.deleteOne(Review)
exports.updateOne=factory.updateOne(Review)
exports.createOne=factory.createOne(Review)
exports.setUserAndTourId=(req,resp,next)=>{
    if(!req.body.tour)req.body.tour=req.params.tourId
    if(!req.body.user)req.body.user=req.user.id
    next()
}
exports.getReview=factory.getOne(Review)
exports.getAllReviews=factory.getAll(Review)