const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: "Hall" }, // Reference to Hall
  seatColumn: { type: Number },
  seatRow: { type: Number },
  seatName: { type: String,  unique: true},
  seatStatus: { type: Boolean, default: false },
});

const Seat = mongoose.model("Seat", seatSchema);
module.exports = Seat;
