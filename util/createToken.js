const sendResponse=require("../helper/sendResponse").sendResponse
module.exports=createToken=function(user,status,data,req,resp){
    const cookieOptions = {
        expire: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
      };
      if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
      const token=signToken(user._id)
      resp.cookie('jwt', token, cookieOptions);
       sendResponse(req,resp,status,data)
}
