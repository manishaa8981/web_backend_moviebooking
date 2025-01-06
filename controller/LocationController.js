const Location = require("../model/Location");

const findAll = async (req, res) => {
  try {
    const location = await Location.find();
    res.status(200).json(location);
  } catch (e) {
    res.join(e);
  }
};

const save = async (req, res) => {
  try {
    const { district, address } = req.body;
    const location = new Location({
      district,
      address,
    });
    await location.save();
    res.status(201).json(location);
  } catch (e) {
    res.json(e);
  }
};
const findById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    res.status(200).json(location);
  } catch (e) {
    res.json(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const location = await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted.");
  } catch (e) {
    res.json(e);
  }
};
const update = async (req, res) => {
  try {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(location);
  } catch (e) {
    res.json(e);
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
};
