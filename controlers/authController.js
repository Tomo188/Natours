const crypto=require("crypto")
const User = require('../models/user_models');
const {promisify}=require("util")
const signToken = require('../util/signToken');
// req,resp,status,data
const jwt = require('jsonwebtoken');
const sendResponse = require('../helper/sendResponse').sendResponse;
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const Email=require("./../util/email")
const createToken=require("../util/createToken")
const deleteCoockie=require("../util/deleteCookie")
exports.signup = catchAsync(async (req, resp, next) => {
  const userData = req.body;
  const newUser = await User.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    confirmPassword: userData.confirmPassword,
    photo:userData.photo?userData.photo:"default.jpg"
  });
  const url=`${req.protocol}://${req.get("host")}/account`
  // await new Email(newUser,url).sendWelcome()
  const token = signToken(newUser._id);
  sendResponse(req, resp, 201, {
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, resp, next) => {
  const { email, password } = req.body;
  //check if email or password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // check if user existis and is password correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorect email or password', 400));
  }
  const token=signToken(user._id)
  
  createToken(user,201,{
    status: 'success',
    token
  },req,resp)
});
exports.logout=(req,resp)=>{
  deleteCoockie(req,resp)
}
exports.protect = catchAsync(async (req, resp, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }else if(req.cookies.jwt){
    token = req.cookies.jwt      
  }
  if(!token){
    return next(new AppError('you are not registred',401))
}
const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET)
const freshUser= await User.findById(decoded.id)
if(!freshUser){
  return next(new AppError('user belonging to this token does not anymore exists',401))
}
if(freshUser.changedPasswordAfter(decoded.iat)){
  return next(new AppError('User recently changed password,please login again',401))
}
req.user=freshUser
resp.locals.user=freshUser
next()
});

exports.restrictTo=function(...roles){
  return (req,resp,next)=>{
    // roles ["admin","lead-guide"].role
    if(!roles.includes(req.user.role)){
      return next(new AppError("you dont have permission to preforme this action",403))
    }
    next()
  }
}
exports.forgotPassword=catchAsync(async(req,resp,next)=>{
   //1. get user based on posted email
   const user=await User.findOne({email:req.body.email})
   if(!user){
    return next(new AppError("There is no user with email adress",404))
   }
   //2. generated random reset token
   const resetToken=user.createPasswordResetToken()
   
   await user.save({validateBeforeSave:false})
   //3. send it to users email
   const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
   const message=`Fotgot your password? Submit a patch request with your new password and password confirm to: ${resetUrl}. \nIf you didn't forget your password, please ignore this email!`
try{
  // await Email({
  // email:user.email,
  // subject:"Your Password reset token(Valid for 10 min)",
  // message:message
// })
 await new Email(user,resetUrl).sendPasswordRreset()
sendResponse(req,resp,200,{
  status:"success",
  message:"Token send to email",
  resetToken
})
}
catch(err){
  user.passwordResetToken=undefined
  user.passwordResetExpires=undefined
  await user.save({validateBeforeSave:false})
  return next(new AppError("There was an error sending email.Try again leater",500))
}
  

})
exports.resetPassword=catchAsync(async(req,resp,next)=>{
//1 get user based on the token
const hashedToken=crypto.createHash("sha256").update(req.params.token).digest("hex")
const user=await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt:Date.now()}})
//2 if token has not expired and there is user set the new password
if(!user) return next(new AppError("Token is invalid or expired",400))
user.password=req.body.password
user.confirmPassword=req.body.password
user.passwordResetExpires=undefined
await user.save()
//3 update changedPasswordAt property for the user

//4 Log the user in, send JWT
const token=signToken(user._id)
sendResponse(req,resp,200,{
  status:"succesfully password changed",
  token
})
})
exports.updatePassword=catchAsync(async(req,resp,next)=>{
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newPassword;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!
        
  // 4) Log user in, send JWT
  // request 
  const token=signToken(user._id)
  createToken(user,200,{
    status: 'sucess',
    token,
    message:"you updated password"
  },req,resp)
 
})
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};