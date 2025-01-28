const Seat = require("../model/Seat");

const createSeat = async (req, res) => {
  const { seats } = req.body;

  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: "Seats data is missing or invalid." });
  }

  try {
    // Extract seat numbers from the request
    const seatNumbers = seats.map((seat) => seat.seatNumber);

    // Check for duplicate seat numbers in the database
    const existingSeats = await Seat.find({
      seatNumber: { $in: seatNumbers },
    });

    const existingSeatNumbers = existingSeats.map((seat) => seat.seatNumber);

    // Filter out seats that already exist
    const newSeats = seats.filter(
      (seat) => !existingSeatNumbers.includes(seat.seatNumber)
    );

    if (newSeats.length === 0) {
      return res
        .status(400)
        .json({ error: "All provided seat numbers already exist." });
    }

    // Add default values for missing fields in the request body
    newSeats.forEach((seat) => {
      if (!seat.booked) {
        seat.booked = false; // Default to not booked
      }
    });

    // Insert new seats into the database
    const createdSeats = await Seat.insertMany(newSeats);
    res.status(201).json(createdSeats);
  } catch (error) {
    console.error("Error creating seats:", error.message); // Improved error logging
    res
      .status(500)
      .json({ error: "Failed to create seats. Please try again." });
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

