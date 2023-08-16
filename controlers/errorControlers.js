const AppError=require("../util/appError")
const sendErrorDev = (err,req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  })
  }

const sendErrorProd = (err,req, resp) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return resp.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return resp.status(500).json({
      status: 'error',
      err,
      message:err.message
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return resp.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return resp.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};
const handleDuplicateFields=(err)=>{
    const error=err.keyValue.name
    const message=`Duplicate field value: x. please use onother value!`.replace("x",error)
    return new AppError(message,400)
}
const handleCastErrorDb=(err)=>{
   const message=`Invalid ${err.path}:${err.value}`
   return new AppError(message,400)
}
const handleValidationErrorDb=(err)=>{
    const errors=Object.values(err.errors).map(error=>error.message)

    return new AppError(`Invalid data input ${errors.join(". ")}`,400)
}
const handleJWTError=(err)=>{
  return new AppError(`Invalid token please log in again`,401)
}
const handleTokenExpiredError=(err)=>{
  return new AppError("Your token has expired please login again",401)
}
module.exports = (err, req, resp, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  const NODE_ENV_BOLEAN = process.env.NODE_ENV;
  if (NODE_ENV_BOLEAN === 'development') {
    sendErrorDev(err,req, resp);
  } else  {
    console.log(err.name)
    let error={...err}
    if(error.name==="CastError") error=handleCastErrorDb(error)
    if(error.code===11000) error=handleDuplicateFields(error)
    if(error.name==="ValidationError") error=handleValidationErrorDb(error)
    sendErrorProd(error,req, resp);
    if(error.name==="JsonWebTokenError")error=handleJWTError(error)
    if(error.name==="TokenExpiredError")error=handleTokenExpiredError(error)
  }
};
