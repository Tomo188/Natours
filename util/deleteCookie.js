const sendResponse=require("../helper/sendResponse").sendResponse

module.exports=deleteCockie=(req,resp)=>{
    resp.cookie("jwt","logedout",{
      expires:new Date(Date.now()+10000),
      httpOnly:true
    })
    sendResponse(req,resp,200,{
      status:"success",
      message:"you are log out now"
    })
  }