"use strict"

const ObjectId=require("mongodb").ObjectId
const Booking=require("../models/booking_models")
// const Tour=require("../models/tour_models")
// const User=require("../models/user_models")
async function checkForBookings(userId,tourId){
    const user_id=new ObjectId(userId)
    const tour_id=new ObjectId(tourId)
    let booking=await Booking.find({$and:[{user:user_id},{tour:tour_id}]})
    if(booking[0])return true
    return false
    
}

module.exports=checkForBookings