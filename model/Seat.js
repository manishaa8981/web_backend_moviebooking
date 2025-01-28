const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: "Hall" }, // Reference to Hall
  seatCount: { type: Number },
  seatRow: { type: Number },
  seatNumber: { type: Number, unique: true },
  booked: { type: Boolean, default: false },
});

const Seat = mongoose.model("Seat", seatSchema);
module.exports = Seat;
