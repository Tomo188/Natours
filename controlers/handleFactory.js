const sendResponse=require("../helper/sendResponse").sendResponse
const catchAsync=require("../util/catchAsync")
const AppError=require("../util/appError")
const APIFeatures=require("../util/APIFeatures")

exports.deleteOne=Model =>  catchAsync(async (req, resp,next) => {
    // try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if(!doc){
        return next(new AppError("No doc found",404))
      }
      sendResponse(req, resp, 200, { success: true,data:null });
  
    // } catch (error) {
    //   sendResponse(req, resp, 404, { success: false, message: error.message });
    // }
  });
  exports.updateOne=Model=>catchAsync(async function (req,resp,next){
    const docu = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!docu){
      return next(new AppError("No tour found",404))
    }
    sendResponse(req, resp, 200, {
      success: true,
      data: {
        data:docu,
      },
    });
  })
  exports.createOne=Model => catchAsync(async function(req,resp,next){
  const doc = await Model.create(req.body);
  sendResponse(req, resp, 200, {
    status: 'success',
    data: {
      doc,
    },
  });
  })   
  exports.getOne=(Model,popOptions)=>catchAsync(async(req,resp,next)=>{
    let query=Model.findById(req.params.id)
    if(popOptions){
      query=query.populate(popOptions)
    }
    const doc=await query
    if(!doc){
      return next(new AppError("No document found with that id",404))
    }
    sendResponse(req,resp,200,{
      data:{
        data:doc
      }
    })
      })
  exports.getAll=(Model,popOptions)=>catchAsync(async(req,resp,next)=>{
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitedFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    sendResponse(req,resp,200,{
      data:{
        data:doc
      }
    })
  })    

