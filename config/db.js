const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/movie_ticket_booking");
    console.log("Database connection established succesfully.");
  } catch (e) {
    console.log("Database not connected.");
  }
};
module.exports = connectDB;
