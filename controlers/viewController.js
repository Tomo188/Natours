const sendResponseRender = require('../helper/sendResponse').sendResponseRender;
const Tour = require('../models/tour_models');
const User=require("../models/user_models");
const Bookings=require("../models/booking_models")
const catchAsync = require('../util/catchAsync');
const AppError=require("../util/appError")
exports.alerts=(req,resp,next)=>{
  const {alert}=req.query
  if(alert==="booking"){
    resp.locals.alert="Your booking was successefull. Please check your email for confirmation."
  }
  next()
}
exports.base = catchAsync(async (req, resp, next) => {
  const tours = await Tour.find();
  sendResponseRender(resp, '', {
    title: 'all tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, resp, next) => {
  const tour = await Tour.findOne({ slug:req.params.slug }).populate({path:"reviews",fields:"review rating user"});
  
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  resp.set(
    
  )
  sendResponseRender(resp, 'tour', {
    title:`${tour.name} Tour`,
    tour
  });

});
exports.getMyTours=async(req,resp,next)=>{
  const bookings=await Bookings.find({user:req.user.id})
  const myBooking=bookings.map(el=>el.tour)
  const tours=await Tour.find({_id:{$in:myBooking}})
  // if(req.params.alert){
  //   return sendResponseRender(resp,"overview",{
  //     title,tours,alert:"Thak you for purchase tour"
  //   })
  // }
  sendResponseRender(resp, 'overview', {
    title: 'your tours',
    tours,
  });
  
}
exports.getOverview =catchAsync(async (req, resp, next) => {
    const tours = await Tour.find();
    sendResponseRender(resp, 'overview', {
      title: 'all tours',
      tours,
    });
  });
exports.login=catchAsync(async (req, resp, next) => {
  sendResponseRender(resp, 'login', {
    title:"login in your account"
  })
})
exports.account=catchAsync(async(req,resp,next)=>{
  sendResponseRender(resp,"account",{
    title:"account"
  })
})
exports.submitUserData=catchAsync(async(req,resp,next)=>{
  const user=await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },{
    new:true,
    runValidators:true
  })
  sendResponseRender(resp,"account",{
    title:"account",
    user
  })
  }
  )
  exports.signup=catchAsync(async(req,resp,next)=>{
    sendResponseRender(resp,"sign_up",
    {title:"signup"})
  })