"use strict";
const Bookings=require("../models/booking_models")
const User=require("../models/user_models")
const createBooking=async (session)=>{
    console.log(session)
    const tour=session.client_reference_id
    const user=(await User.findOne({email:session.customer_email})).id
    const price=session.line_items[0].amount/100
  await Bookings.create({tour,user,price})
}


module.exports=createBooking