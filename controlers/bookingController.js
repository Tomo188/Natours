const Tour=require("../models/tour_models")
const Booking=require("../models/booking_models")
const factory=require("./handleFactory")
const AppError=require("./../util/appError")
const catchAsync=require("../util/catchAsync")
const createBooking=require("../helper/createBooking")
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY)


exports.getCheckoutSession=catchAsync(async(req,resp,next)=>{
    const tour=await Tour.findById(req.params.tourID)
    const session=await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        // success_url:`${req.protocol}://${req.get("host")}/?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`
        success_url:`${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
        cancel_url:`${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.tourID,
        mode:"payment",
        line_items: [{ 
            quantity: 1,
            price_data: { 
              currency: 'usd', 
              product_data:{ 
                name:tour.name,
              }, 
              unit_amount:tour.price*100,
            } 
          }],
    })
    resp.status(200).json({
        status:"success",
        session
    })
})
exports.testBooking=(req,res,next)=>{
  next()
}
exports.createBookingCheckout=async(req,resp,next)=>{
  const {tour,user,price}=req.query
  if(!tour && !user && !price)return next()
  await Booking.create({tour,user,price})
  resp.redirect(req.originalUrl.split("?")[0])
}
exports.webhookCheckout=(req,resp,next)=>{
  let event
  try{
    const signature=req.headers["stripe-signature"]
     event=stripe.webhooks.constructEvent(req.body,signature,process.env.STRIPE_WEBHOOK_SECRET)
  }
  catch(err){
    return resp.status(400).send(`Webhook error: ${err.message}`)
  }
   console.log(event)
   if(event.type==="checkout.session.completed"){
    console.log("enter in")
      createBooking(event.data.object)
      resp.status(200).json({
        recived:true
      })
   }
}
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);