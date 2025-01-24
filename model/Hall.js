const { required } = require("joi");
const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  hall_name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seats: {
    type: [Number], // Array of seat numbers
    required: true,
  },
  status: {
    type:String,
    enum: ["availaable", "reserved", "selected"], 
    required: true,
  },
  // seatId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "seats",
  // },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
  },
});

const Hall = mongoose.model("halls", hallSchema);

module.exports = Hall;
