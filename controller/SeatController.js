// const Seat = require("../model/Seat");

// const findAll = async (req, res) => {
//   try {
//     const seats = await Seat.find();
//     res.status(200).json(seats);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching seats", error: error.message });
//   }
// };

// const save = async (req, res) => {
//   try {
//     const { seat_number, row_number, is_available, hallId } = req.body;

//     // Validate required fields
//     if (!seat_number || !row_number || !is_available || !hallId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const seat = new Seat({
//       seat_number,
//       row_number,
//       is_available,
//       hallId,
//     });
//     await seat.save();
//     res.status(201).json(seat);
//   } catch (e) {
//     res
//       .status(500)
//       .json({ error: "Failed to save showtime", details: e.message });
//   }
// };

// const deleteById = async (req, res) => {
//   try {
//     const seat = await Seat.findByIdAndDelete(req.params.id);

//     if (!seat) {
//       return res.status(404).json({ error: "Seat not found" });
//     }

//     res.status(200).json({ message: "Seat deleted successfully" });
//   } catch (e) {
//     res
//       .status(500)
//       .json({ error: "Failed to delete seat", details: e.message });
//   }
// };

// const update = async (req, res) => {
//   try {
//     const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true, // Ensures Mongoose schema validation
//     });

//     if (!seat) {
//       return res.status(404).json({ error: "Seat not found" });
//     }

//     res.status(200).json(seat);
//   } catch (e) {
//     res
//       .status(500)
//       .json({ error: "Failed to update seat", details: e.message });
//   }
// };

// // Reserve seats temporarily

// const selectSeats = async (req, res) => {
//   const { showtimeId, seatIds } = req.body; // Extract parameters from req.body
//   try {
//     // Mark seats as selected
//     await Seat.updateMany(
//       { _id: { $in: seatIds }, status: "available", showtime_id: showtimeId },
//       { $set: { status: "selected", selected_at: new Date() } }
//     );
//     res.status(200).send({ message: "Seats selected successfully!" });
//   } catch (error) {
//     console.error("Error selecting seats:", error);
//     res.status(500).send({ error: "Error selecting seats!" });
//   }
// };

// const confirmBooking = async (req, res) => {
//   const { userId, showtimeId, seatIds } = req.body; // Extract parameters from req.body
//   try {
//     // Reserve seats and create a booking
//     await Seat.updateMany(
//       { _id: { $in: seatIds }, status: "selected", showtime_id: showtimeId },
//       { $set: { status: "reserved" } }
//     );
//     await Booking.create({
//       user_id: userId,
//       showtime_id: showtimeId,
//       seat_ids: seatIds,
//       status: "confirmed",
//     });
//     res.status(200).send({ message: "Booking confirmed!" });
//   } catch (error) {
//     console.error("Error confirming booking:", error);
//     res.status(500).send({ error: "Error confirming booking!" });
//   }
// };

// module.exports = {
//   findAll,
//   save,
//   deleteById,
//   update,
//   confirmBooking,
//   selectSeats,
// };

const Seat = require("../model/Seat");

// Create a new seat
const createSeat = async (req, res) => {
  const { seatNumber } = req.body;

  try {
    const newSeat = new Seat({
      seatNumber,
      booked: false, // By default, the seat is not booked
    });

    await newSeat.save();
    res.status(201).json(newSeat);
  } catch (error) {
    console.error("Error creating seat:", error);
    res.status(500).json({ error: "Failed to create seat" });
  }
};

// Get all seats
const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.status(200).json(seats);
  } catch (error) {
    console.error("Error fetching seats:", error);
    res.status(500).json({ error: "Failed to fetch seats" });
  }
};

// Get available and unavailable seats
const getSeatsStatus = async (req, res) => {
  try {
    const availableSeats = await Seat.find({ booked: false });
    const unavailableSeats = await Seat.find({ booked: true });

    res.status(200).json({
      availableSeats,
      unavailableSeats,
    });
  } catch (error) {
    console.error("Error fetching seat statuses:", error);
    res.status(500).json({ error: "Failed to fetch seat statuses" });
  }
};

// Book a seat
const bookSeat = async (req, res) => {
  const { seatNumber } = req.body;

  try {
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    if (seat.booked) {
      return res.status(400).json({ error: "Seat is already booked" });
    }

    seat.booked = true; // Mark seat as booked
    await seat.save();

    res.status(200).json({ message: "Seat successfully booked", seat });
  } catch (error) {
    console.error("Error booking seat:", error);
    res.status(500).json({ error: "Failed to book seat" });
  }
};
// Unbook a seat
const unbookSeat = async (req, res) => {
  const { seatNumber } = req.body;

  try {
    const seat = await Seat.findOne({ seatNumber });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    if (!seat.booked) {
      return res.status(400).json({ error: "Seat is already available" });
    }

    seat.booked = false; // Mark seat as available
    await seat.save();

    res.status(200).json({ message: "Seat successfully unbooked", seat });
  } catch (error) {
    console.error("Error unbooking seat:", error);
    res.status(500).json({ error: "Failed to unbook seat" });
  }
};

module.exports = { createSeat, getSeats, getSeatsStatus, bookSeat, unbookSeat };
