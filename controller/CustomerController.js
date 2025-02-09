const Customer = require("../model/Customer");
const nodemailer = require("nodemailer");

const findAll = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (e) {
    res.json(e);
  }
};

const save = async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      protocol: "smtp",
      auth: {
        user: "manishaa8981@gmail.com",
        pass: "dtebhpaccivhkhth",
      },
    });

    const info = transporter.sendMail({
      from: "manishaa8981@gmail.com",
      to: customer.email,
      subject: "Customer Registration",
      html: `
            <h1>Your Registration has been Completed</h1>
            <p>your user id is ${customer.id}</p>
            `,
    });

    res.status(201).json({ customer, info });
  } catch (e) {
    res.json(e);
  }
};

const findById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.status(200).json(customer);
  } catch (e) {
    res.json(e);
  }
};
const deleteById = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json("Data Deleted");
  } catch (e) {
    res.json(e);
  }
};

const update = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(201).json(customer);
  } catch (e) {
    res.json(e);
  }
};

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
  uploadImage,
};
