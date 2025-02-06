const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({
  hall_name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
  },
});

// hallSchema.pre("save", function (next) {
//   if (!this.seats || this.seats.length === 0) {
//     const generatedSeats = [];
//     const rows = this.rows;
//     const seatsPerRow = this.seats_per_row;

//     for (let i = 0; i < rows; i++) {
//       const rowLabel = String.fromCharCode(65 + i); // Convert 0 -> 'A', 1 -> 'B', etc.
//       for (let j = 1; j <= seatsPerRow; j++) {
//         generatedSeats.push(`${rowLabel}${j}`); // Generate seat identifier, e.g., A1, A2, etc.
//       }
//     }

//     this.seats = generatedSeats;
//   }
//   next();
// });

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;
