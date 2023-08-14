const mongoose=require("mongoose")
const bookingSchema=mongoose.Schema({
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"Tour",
        required:[true,"booking must belong to Tour"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"booking must have user"]
    },
    price:{
        type:Number,
        required:[true,"Booking must have price"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
})
bookingSchema.pre(/^find/,function(next){
    this.populate("user").populate({
        path:"tour",
        select:"name"
    })
    next()
})
const Booking=mongoose.model("Booking",bookingSchema)
module.exports=Booking