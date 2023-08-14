// review,rating,createdAt,ref to tour,ref to user
const mongoose=require('mongoose');
const Tour=require("../models/tour_models")
const reviewSchema= new mongoose.Schema({
    review:{
        type:String,
        required:[true,"review must have review"]
    },
    rating:{
        type:Number,
        required:[true,"review must rating"],
        min:[1,"1 is lovest rating for tour"],
        max:[5,"5 is gratest rating for tour"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        requierd:[true,"review must have user"]
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:"Tour",
        required:[true,"review must have tour"]
    },
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
    reviewSchema.index({tour:1,user:1},{unique:true})
reviewSchema.pre(/^find/,function(next){
    // this.populate({
    //     path:"tour",
    //     select:"name"
    // }).populate({
    //     path:"user",
    //     select:"name photo"
    // })
    this.populate({
        path:"user",
        select:"name photo"
    })
 next()
})
reviewSchema.statics.calcAverageRating=async function(tourId){
     
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },{
            $group:{
                _id:"$tour",
                nRating:{$sum:1},
                avgRating:{
                    $avg:"$rating"
                }
            }
        }
    ])
    // console.log(stats)
    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAvrage:stats[0].nRating,
            ratingsQuantatity:stats[0].avgRating
        })
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsAvrage:0,
            ratingsQuantatity:4.5
        })
    }
}
reviewSchema.post("save",function (next){
    this.constructor.calcAverageRating(this.tour)
    
})
reviewSchema.pre(/^findOneANd/,async function(next){
   this.r=await this.findOne()
//    console.log(this.r)
   next()
})
reviewSchema.pre(/^findOneAnd/,async function(){
   await this.r.constructor.calcAverageRating(this.r.tour)
})
const Review=mongoose.model('Review',reviewSchema)
module.exports =Review