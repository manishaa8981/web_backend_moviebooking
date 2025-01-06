const Threater = require("../model/Threater");

const findAll = async (requestAnimationFrame, res) => {
  try {
    const threater = await Threater.find().populate("locationId");
    res.status(200).json(threater);
  } catch (e) {
    res.json(e);
  }
};

const save = async (req, res) => {
  try {
    const { threater_name, locationId, contact_no } = req.body;
    const threater = new Threater({
      threater_name,
      locationId,
      contact_no,
    });
    await threater.save();
    res.status(201).json(threater);
  } catch (e) {
    res.json(e);
  }
};

const findById = async (req, res) => {
  try {
    const threater = await Threater.findById(req.params.id);
    res.status(200).json(threater);
  } catch (e) {
    res.json(e);
  }
};

const deleteById = async (req, res) => {
  try {
    const threater = await Threater.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted.");
  } catch (e) {
    res.json(e);
  }
};

const update = async (req, res) => {
  try {
    const threater = await Threater.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(threater);
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
