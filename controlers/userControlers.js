
const User=require("../models/user_models")
const catchAsync=require("../util/catchAsync")
const sendResponse = require('../helper/sendResponse').sendResponse;
const AppError = require('../util/appError');
const filterObj=require('../util/filterObject');
const factory=require("./handleFactory")
const multer=require("multer")
const sharp=require("sharp")
// const multerStorage=multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,"public/img/users",)
//   },
//   filename:(req,file,cb)=>{
//     // user-id-currentTimeStamp
//     const ext=file.mimetype.split("/")[1]
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`)
//   }
// })
const multerStorage=multer.memoryStorage()
const multerFilter=(req,file,cb)=>{
  if(file.mimetype.startsWith("image")){
    cb(null,true)
  }else{
    cb(x,false)
  }
}
const upload=multer({
  storage:multerStorage,
  fileFilter:multerFilter
})
exports.uploadPhoto=upload.single("photo")
exports.resizeUserPhoto=catchAsync(async(req,resp,next)=>{
  if(!req.file)return next()
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`
  await sharp(req.file.buffer).resize(500,500).toFormat("jpeg").jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
  next()
})
exports.allUsers =catchAsync(async function (req, resp) {
  const users=await User.find()
  sendResponse(req,resp,200,{
    status:"success",
    data:{
      data:users
    }
  })
});
exports.createUser = factory.createOne(User)

exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
exports.updateUser = function (req, resp) {
  errorMessageUsers(req, resp);
};
exports.updateMe=catchAsync(async(req,resp,next)=>{
  // create error if user posts password data
  if(req.body.password || req.body.confirmPassword){
    return next(new AppError("this is not for password update. Please use /updatePassword",400))
  }
  const filterBody=filterObj(req.body,"name","email")
  if(req.file) filterBody.photo=req.file.filename
  const user=await User.findByIdAndUpdate(req.user.id,filterBody,{
    new:true,
    runValidators:true
  })
  sendResponse(req,resp,200,{
    status:"success",
    user
  })
})
exports.deleteMe=catchAsync(async(req,resp,next)=>{
  const user=await User.findById(req.user.id,{active:true})
  user.active=false
  user.save()
  sendResponse(req,resp,204,{
    status:"success",
    message:"delete me "
  })
})
function errorMessageUsers(req, resp, msg = '505 error server message') {
  resp.status(500).json({
    status: 500,
    message: msg,
  });
}
exports.getMe=(req,resp,next)=>{
  req.params.id=req.user.id
  next()
}