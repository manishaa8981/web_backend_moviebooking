const ShowTime = require("../model/ShowTime");

const findAll = async (req, res) => {
  try {
    const showTimes = await ShowTime.find().populate(["movieId", "hallId"]);
    res.status(200).json(showTimes);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to fetch showtimes", details: e.message });
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
      hallId, // Fixed incorrect reference
    });
    await showTime.save();
    res.status(201).json(showTime);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to save showtime", details: e.message });
  }
};

const findById = async (req, res) => {
  try {
    const showTime = await ShowTime.findById(req.params.id).populate([
      "movieId",
      "hallId",
    ]);

    if (!showTime) {
      return res.status(404).json({ error: "ShowTime not found" });
    }

    res.status(200).json(showTime);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to fetch showtime", details: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const showTime = await ShowTime.findByIdAndDelete(req.params.id);

    if (!showTime) {
      return res.status(404).json({ error: "ShowTime not found" });
    }

    res.status(200).json({ message: "ShowTime deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to delete showtime", details: e.message });
  }
};

const update = async (req, res) => {
  try {
    const showTime = await ShowTime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensures validation rules are applied
    });

    if (!showTime) {
      return res.status(404).json({ error: "ShowTime not found" });
    }

    res.status(200).json(showTime);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to update showtime", details: e.message });
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
};
