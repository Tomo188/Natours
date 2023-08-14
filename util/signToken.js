const jwt = require('jsonwebtoken');
module.exports=signToken=function(id){
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
      })
 
}