class APIFeatures{
    constructor(query,queryString){
      this.query = query;
      this.queryString = queryString;
    }
    filter(){
      const queryObject={...this.queryString}
      const excludeFields=["page","sort","limit","fields"]
      excludeFields.map(field=>delete queryObject[field])
      const queryObjectString=JSON.parse(JSON.stringify(queryObject).replace(/\b(gte|gt|lt|lte)\b/g,match=>`$${match}`))
       this.query.find(queryObjectString)
       return this
    }
    sort(){
      if(this.queryString.sort){
        const sortBy=this.queryString.sort.split(',').join(" ");
        this.query=this.query.sort(sortBy)
      }else{
        this.query=this.query.sort("-createdAt")
      }
      return this
    }
    limitedFields(){
      if(this.queryString.fields){
        const fields=this.queryString.fields.split(',').join(" ");
        this.query=this.query.select(fields)
      }else{
        this.query=this.query.select("-__v")
      }
      return this
    }
    paginate(){
      const page=this.queryString.page*1||1
      const limit=this.queryString.limit*1||10
      const skip=(page-1)*limit
      this.query=this.query.skip(skip).limit(limit)
      return this
    }
  }
  module.exports=APIFeatures