const mongoose=require('mongoose')
const slugify=require('slugify')
const validator=require('validator')
const User = require('./user_models')
const tourSchema=new mongoose.Schema(
    {
      name:{
        type:String,
        required: [true,"A Tour must have a name"],
        unique: true, 
        trim:true,
        //validate:[validator.isAlpha,"Tour name must only contains characters"]

      },
      slug:String,
      duration:{
        type:Number,
        required:[true,"a tur must have a duration"]
      },
      description:String,
      maxGroupSize:{
        type:Number,
        required:[true,"a tur must have a max group size"]
      },
      difficulty:{
        type:String,
        required:[true,"a tur must have a difficulty"],
        enum:{
          values:["easy","medium","difficult"],
          message:'you must select a difficulty beetwen this values easy,medium,difficult',
        }
      },
      rating:{
           type:Number,
           default:4.5,
           min:[1,"minimum is 1.0 for rating"],
            max:[5,"maximum is 5.0 for rating"]
          },
          ratingsAvrage:{
            type:Number,
            default:4.5,
            min:[1,"rating must be above 1.0"],
            max:[5,"rating must be below 5.0"],
            set:val=>Math.round(val*10)/10
           
          },
          ratingsQuantatity:{
          type:Number,
          default:0
          },
          priceDiscount:Number,
      price:{
       type:Number,
       required:[true,"A tour must have a price"]
      },
      priceDiscount:{
        type:Number,
        validator:{
          validate:function(val){
            return val<this.pricee
         },
         message:"discount price {{VALUE}} mut be lower then price"
        }
      },
      summary:{
        type:String,
        trim:true,
      },
      imageCover:{
        type:String,
        required:[true,"You must add image cover photo name"]
      },
      images:[String],
      createdAt:{
        type:Date,
        default:Date.now(),
        select:false
        
      },
      startDates:[Date],
      secretTour:{
        type:Boolean,
        default:false
      },
        startLocation:{
          type:{
            type:String,
            default:"Point",
            enum:["Point"]
          },
          coordinates:[Number],
          adress:String,
          description:String, 
        },
        locations:[{
          type:{
            type:String,
            default:"Point",
            enum:["Point"]
          },
          coordinates:[Number],
          adress:String,
          description:String
        }],
        // guides:Array,
        guides:[
          {
            type:mongoose.Schema.ObjectId,
            ref:"User"
          }
        ],
    },
    {
      toJSON:{virtuals:true},
      toObject:{virtuals:true}
    }
  
  )
  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7
  })
  //Documnet middleware runs before save() and create()
  tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true})
    next()
  })
  tourSchema.pre("save",async function(next){
    const guidesPromises=this.guides.map(async id => await User.findById(id))
    this.guides=await Promise.all(guidesPromises)
    next()
  })
  tourSchema.pre( /^find/,function(next){
    this.find({secretTour:{$ne:true}})
    next()
  })
  tourSchema.pre(/^find/,function(next){
    this.populate({
      path:"guides",
      select:"-__v -passwordChangedAt"
    });
    next()
  })
  tourSchema.index({price:1,ratingsAvrage:-1})
  tourSchema.index({slug:1})
  tourSchema.index({startLocation:"2dsphere"})
  //virtual populate
  tourSchema.virtual("reviews",{
        ref:"Review",
        foreignField:"tour",
        localField:"_id"
  })
  //aggregation middleware geo neo must be first if we uncoment this we must change order that geo neo be first
  // tourSchema.pre('aggregate',function(next){
  //   this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
  //   next()
  // })
  // tourSchema.post( /^find/,function(docs,next){
  //   next()
  // })
  // tourSchema.pre("save",function(next){
  //   next()
  // })
  // tourSchema.post("save",function(doc,next){
  //   console.log(doc)
  //   next()
  // })
  // const testTour=new Tour({
  //   name:"sumska setnja",
  //   rating:5.5,
  //   price:200
  // })
  // testTour.save();
//   async function testTourAK(){
//     const tours=await Tour.find()
//   }
//  testTourAK();
 const Tour=mongoose.model("Tour",tourSchema)
  module.exports=Tour