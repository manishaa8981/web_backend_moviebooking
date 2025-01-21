const Seat = require("../model/Seat");


const findAll = async (req, res) => {
  try {
    const seats = await Seat.find();
    res.status(200).json(seats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching seats", error: error.message });
  }
};

const save = async (req, res) => {
  try {
    const { start_time, end_time, date, movieId, hallId } = req.body;

    // Validate required fields
    if (!start_time || !end_time || !date || !movieId || !hallId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const showTime = new ShowTime({
      start_time,
      end_time,
      date,
      movieId,
      hallId, // Using hallId as per your model
    });
    await showTime.save();
    res.status(201).json(showTime);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to save showtime", details: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    res.status(200).json({ message: "Seat deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to delete seat", details: e.message });
  }
};

const update = async (req, res) => {
  try {
    const seat = await Seat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensures Mongoose schema validation
    });

    if (!seat) {
      return res.status(404).json({ error: "Seat not found" });
    }

    res.status(200).json(seat);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to update seat", details: e.message });
  }
};

module.exports = {
  findAll,
  save,
  deleteById,
  update,
};
