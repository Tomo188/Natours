const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto=require("crypto")
// name,email,password,passwordConfirm,photo
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have a name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail],
  },
  password: {
    type: String,
    required: [true, 'user must have a password'],
    minlength: 8,
    select:false
  },
  confirmPassword: {
    type: String,
    required: [true, 'user must have a confirm password'],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'password are not same',
    },

  },
  photo:{
    type: String,
    default:"default.jpg"
  },
  role:{
      type: String,
      enum:["user","guide","lead-guide","admin"],
      default:"user"
  },
  active:{
    type:Boolean,
    default:true,
    select:false
  },
  passwordChangedAt: Date,
  passwordResetToken:String,
  passwordResetExpires:Date,

});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.pre("save",function(next){
  if(!this.isModified("password") || this.isNew)return next()
  this.passwordChangedAt=Date.now()- 1000
  next()
})
userSchema.pre(/^find/,function(next){
  this.find({active:{$ne:false}})
  next()

})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword)
}
userSchema.methods.changedPasswordAfter=function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10)

    return JWTTimestamp<changedTimestamp
  }
  return false
}
userSchema.methods.createPasswordResetToken=function(){
  const resetToken=crypto.randomBytes(32).toString("hex")
  this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex")
  this.passwordResetExpires=Date.now()+10*60*1000
  return resetToken
}
const User = mongoose.model('User', userSchema);
module.exports = User;
