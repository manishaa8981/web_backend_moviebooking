// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   seats_booked: {
//     type: [String], // Assuming seats are identified by seat numbers or IDs
//     required: true,
//   },
//   total_price: {
//     type: Number,
//     required: true,
//   },
//   booking_date: {
//     type: Date,
//     required: true,
//   },
//   booking_status: {
//     type: Boolean,
//     required: true,
//   },
//   customerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "customers",
//     required: true,
//   },
//   showTimeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "showtimes",
//     required: true,
//   },
//   movieId:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "movies",
//     required: true,
//   },

// });

// const Booking = mongoose.model("bookings", bookingSchema);

// module.exports = Booking;
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
  showtimeId: { type: mongoose.Schema.Types.ObjectId, ref: "ShowTime" },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  payment_status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  },
  total_price: { type: Number },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
