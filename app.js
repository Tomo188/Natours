const express = require('express');
const path=require('path');
const app = express();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const AppError = require('./util/appError');
const globalErrorHandler = require('./controlers/errorControlers');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser=require("cookie-parser");
const compression=require("compression")
const cors=require("cors")
const bookingController=require("./controlers/bookingController")
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'to many requests from this ip adress, please try again later!!!',
});
// trust proxy
app.enable("trust proxy")
// use pug template
app.set("view engine","pug")
app.set("views",path.join(__dirname,"views"))
// cors
app.use(cors())
app.options("*",cors())
// http security headers
const scriptSrcUrls = ["https://unpkg.com/", "https://tile.openstreetmap.org","https://cdnjs.cloudflare.com/"]
const styleSrcUrls = [
  "https://unpkg.com/",
  "https://tile.openstreetmap.org",
  "https://fonts.googleapis.com/",
];
const connectSrcUrls = ["https://unpkg.com", "https://tile.openstreetmap.org","https://cdnjs.cloudflare.com/","http://127.0.0.1:3000/api/v1/users/login"];
const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];
 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", "https:"],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
// request limit
app.use('/api', limiter);
// stripe checkout
app.post("/webhook-checkout",express.raw({type:"application/json"}),bookingController.webhookCheckout)
// body parser reading data
app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({extended:true,limit:"10kb"}))
// coockie-parser
app.use(cookieParser());  
// data sanitize agaainst nosql injection
app.use(mongoSanitize())
//data sanitazion against xss attack
app.use(xss())
// prevent parameter polution
app.use(hpp({
  whitelist:['duration',
  'ratingsQuantity',
  'ratingsAverage',
  'maxGroupSize',
  'difficulty',
  'price']
}))
app.use(compression())
app.use((req, resp, next) => {
  next();
});
// test middleware
app.use((req, resp, next) => {
  req.reqTime = new Date().toISOString();
  next();
});
// app.use((req,resp,next)=>{
//   resp.setHeader("Access-Control-Allow-Origin","*")
//   next()
// })
// development loggin
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname,"public")));

/*app.get('/', (req, resp) => {
  resp.status(200).json({ message: 'Hello from node js???' });
});

app.post('/', (req, resp) => {
  resp.status(200).json({ message: 'hello from nodemon' });
});*/

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require("./routes/reviewRoutes")
const viewRouter=require("./routes/viewRoutes")
const bookingRouter=require("./routes/bookingRoutes")
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use("/api/v1/reviews",reviewRouter)
app.use("/",viewRouter);
app.use("/api/v1/bookings",bookingRouter)
app.all('*', (resp, req, next) => {
  // resp.status(404).json({
  //   status:"fail",
  //   message:`Can't find ${req.orginalUrl}`
  // })
  const err = new Error(`Can't find ${req.orginalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(new AppError(`can't find ${req.orginalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
//app urls
//app.post('/api/v1/tours', createNewTour);
//app.get('/api/v1/tours', getTours);
//app.get('/api/v1/tours/:id', getTour);
//app.patch('/api/v1/tours/:id', patchTour);
//app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
