const Hall = require("../model/Hall");

const findAll = async (req, res) => {
  try {
    const halls = await Hall.find();
    res.status(200).json(halls);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to fetch halls", details: e.message });
  }
};

const save = async (req, res) => {
  try {
    const { capacity, seatId, price, hall_name, ticketPrice, movieId } =
      req.body;

    if (
      !capacity ||
      !seatId ||
      !price ||
      !hall_name ||
      !ticketPrice ||
      !movieId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hall = new Hall({
      capacity,
      seatId,
      price,
      hall_name,
      ticketPrice,
      movieId,
    });

    await hall.save();
    res.status(201).json(hall);
  } catch (e) {
    res.status(500).json({ error: "Failed to save hall", details: e.message });
  }
};

const findById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }

    res.status(200).json(hall);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch hall", details: e.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndDelete(req.params.id);

    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }

    res.status(200).json({ message: "Hall deleted successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to delete hall", details: e.message });
  }
};

const update = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hall) {
      return res.status(404).json({ error: "Hall not found" });
    }

    res.status(200).json(hall);
  } catch (e) {
    res
      .status(500)
      .json({ error: "Failed to update hall", details: e.message });
  }
};

module.exports = { findAll, save, findById, deleteById, update };
