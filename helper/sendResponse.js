// req,resp,status,data
exports.sendResponse=(req,resp,status,data)=>{
    resp.status(status).json(data)
  }
exports.sendResponseRender=(resp,template,data)=>{
 resp.status(200).render(template,data)
}

  