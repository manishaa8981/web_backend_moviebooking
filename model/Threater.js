const mongooose = require("mongoose");

const threaterSchema = new mongooose.Schema({
  threater_name: {
    type: String,
    required: true,
  },
  locationId: {
    type: mongooose.Schema.Types.ObjectId,
    ref: "locations",
  },
  contact_no: {
    type: String,
    required: true,
  },
});

const Threater = mongooose.model("threaters", threaterSchema);

module.exports = Threater;
