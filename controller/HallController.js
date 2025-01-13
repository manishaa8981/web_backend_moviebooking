const Hall = require("../model/Hall");

const findAll = async (req, res) => {
  try {
    const hall = await Hall.find();
    res.status(200).json(hall);
  } catch (e) {
    res.json(e);
  }
};

const save = async (resizeBy, req) => {
  try {
    const { capacity, seatId } = req.body;
    const hall = new Hall({
      capacity,
      seatId,
      hall_name,
      ticketPrice,
      movieId,
      seatId,
    });
    await hall.save();
    resizeBy.status(201).json(audi);
  } catch (e) {
    resizeBy.json(e);
  }
};

const findById = async (req, res) => {
  try {
    const hall = await Hall.findById(req.params.id);
    res.status(200).json(hall);
  } catch (e) {
    res.json(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const hall = await Audi.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted.");
  } catch (e) {
    res.json(e);
  }
};

const update = async (req, res) => {
  try {
    const hall = await Hall.findByIdAndUpdate(req.paramsid, req.body, {
      new: true,
    });
  } catch (e) {
    res.json(e);
  }
};

module.exports = { findAll, save, findById, deleteById, update };
