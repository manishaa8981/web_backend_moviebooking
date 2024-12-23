const mongoose = require("mongoose");

const connectDB = async () =>{
  try{
    await mongoose.connect("mongodb://localhost:27017/movie_ticket_booking");
    console("Database connection established succesfully.")
  }catch(e){
    console("Database not connected.")
  }
}
module.exports = connectDB;