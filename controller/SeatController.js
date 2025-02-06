const Seat = require("../model/Seat");

// Create Seats for a Hall (Bulk Insertion)
const createSeats = async (req, res) => {
  try {
    const { hallId, totalRows, seatsPerRow } = req.body;

    if (!hallId || !totalRows || !seatsPerRow) {
      return res
        .status(400)
        .json({ message: "hallId, totalRows, and seatsPerRow are required" });
    }

    let seats = [];
    for (let row = 1; row <= totalRows; row++) {
      for (let col = 1; col <= seatsPerRow; col++) {
        seats.push({
          hallId,
          seatRow: row,
          seatColumn: col,
          seatName: `${String.fromCharCode(64 + row)}${col}`, // A1, A2, B1, etc.
          seatStatus: false,
        });
      }
    }

    const createdSeats = await Seat.insertMany(seats);
    res.status(201).json(createdSeats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating seats", error: error.message });
  }
};

// Get all seats for a hall
const getSeatsByHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    const seats = await Seat.find({ hallId }).sort({
      seatRow: 1,
      seatColumn: 1,
    });
    res.status(200).json(seats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching seats", error: error.message });
  }
};

// Book a seat
const bookSeat = async (req, res) => {
  try {
    const { seatId } = req.params;
    const seat = await Seat.findById(seatId);

    if (!seat) return res.status(404).json({ message: "Seat not found" });
    if (seat.seatStatus)
      return res.status(400).json({ message: "Seat already booked" });

    seat.seatStatus = true;
    await seat.save();

    res.status(200).json({ message: "Seat booked successfully", seat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking seat", error: error.message });
  }
};

// Cancel a booked seat
const cancelSeatBooking = async (req, res) => {
  try {
    const { seatId } = req.params;
    const seat = await Seat.findById(seatId);

    if (!seat) return res.status(404).json({ message: "Seat not found" });
    if (!seat.seatStatus)
      return res.status(400).json({ message: "Seat is not booked" });

    seat.seatStatus = false;
    await seat.save();

    res.status(200).json({ message: "Seat booking cancelled", seat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error canceling booking", error: error.message });
  }
};

// Delete all seats for a hall (useful for hall reconfiguration)
const deleteSeatsByHall = async (req, res) => {
  try {
    const { hallId } = req.params;
    await Seat.deleteMany({ hallId });
    res.status(200).json({ message: "All seats deleted for the hall" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting seats", error: error.message });
  }
};

module.exports = {
  createSeats,
  getSeatsByHall,
  deleteSeatsByHall,
  bookSeat,
  cancelSeatBooking,
};
