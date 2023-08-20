// importing function to add example data to db
// const addDataExampleToDb=require('./helper/addExampleData');
// addDataExampleToDb.addDataExampleToDb()
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message,err.stack);
  process.exit(1);
});
const mongoose = require('mongoose');
const db = process.env.url.replace('<password>', process.env.password);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify:false
  })
  .then(() => ('connected to db'))
  .catch(() => console.log('not connected'));
const app = require('./app');
const port = process.env.PORT||3000;
const server=app.listen(port, () => {
  (`app is listening at port: ${port}.`);
});
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
process.on("SIGTERM",()=>{
  console.log("Sigterm signal recived application shuting down")
  server.close(()=>{
    console.log("application terminated ")
  })
})
