const mongoose = require("mongoose");

const threaterSchema = new mongoose.Schema({
  threater_name: {
    type: String,
    required: true,
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "locations",
  },
  contact_no: {
    type: String,
    required: true,
  },
});

const Threater = mongoose.model("threaters", threaterSchema);

module.exports = Threater;
