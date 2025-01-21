const { required } = require("joi");
const mongooose = require("mongoose");

const customerSchema = new mongooose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["customer", "admin", "manager"],
    default: "customer",
  },
  email: {
    type: String,
    required: true,
  },
  contact_no: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const Customer = mongooose.model("customers", customerSchema);

module.exports = Customer;
