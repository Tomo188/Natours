module.exports=filterObj=(obj,...alowedFields)=>{
    const newObject={}
    alowedFields.map(field=>{
       newObject[field]=obj[field]
    })
    return newObject
}