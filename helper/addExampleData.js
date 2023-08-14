// const tours=require('../dev-data/data/tours-simple.json')
// const Tours=require('../models/tour_models')
// exports.addDataExampleToDb=()=>{
//     //     tours.map(tourMap)
    
// }
// async function tourMap(test){
//    delete test["id"]
//     try{   
//         await Tours.create({
//         ...test
//     })}
//     catch(error){
//         console.log(error)
//     }
// }
// async function deleteAll(){
//   await Tours.deleteMany();
//}
const fs = require('fs');
const path=require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tours = require('../models/tour_models');
const User=require("../models/user_models")
const Review=require("../models/review_models")
dotenv.config({ path: './config.env' });

const DB = process.env.url.replace('<password>', process.env.password);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(path.resolve(__dirname,"../dev-data/data/tours.json"), 'utf-8')
);
const users=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../dev-data/data/users.json"), 'utf-8'));
const reviews=JSON.parse(fs.readFileSync(path.resolve(__dirname,"../dev-data/data/reviews.json"), 'utf-8'));
// IMPORT DATA INTO DB
const importData = async () => {
  console.log(tours)
  try {
    await Tours.create(tours);
    await User.create(users,{validateBeforeSave:false})
    await Review.create(reviews)
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tours.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
