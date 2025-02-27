const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: "Hall" },
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "ShowTime" },
  seatColumn: { type: Number },
  seatRow: { type: Number },
  seatName: { type: String },
  seatStatus: { type: Boolean, default: false },
});
seatSchema.index({ hallId: 1, showtimeId: 1, seatName: 1 });

const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
