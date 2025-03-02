const Customer = require("../model/Customer");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

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
    if (!customer) return res.status(404).json({ message: "User not found" });

    res.status(200).json(customer);
  } catch (error) {
    console.error("Find User Error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
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
// const update = async (req, res) => {
//   try {
//     const { username, email, contact_no } = req.body;
//     const user = await Customer.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     user.username = username || user.username;
//     user.email = email || user.email;
//     user.contact_no = contact_no || user.contact_no;

//     await user.save();
//     res.status(200).json({ message: "Profile updated successfully!", user });
//   } catch (error) {
//     console.error("Update Profile Error:", error);
//     res.status(500).json({ error: "Failed to update profile" });
//   }
// };

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
};

const uploadImages = async (req, res) => {
  try {
    //  Check if file exists
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    //  Extract customer ID from request (assuming it's coming from authentication middleware)
    const { customerId } = req.params; // Ensure you pass customerId in the route

    //  Find customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Update user's profile image
    customer.image = `/uploads/images/${req.file.filename}`; // Save image path
    await customer.save();

    res.status(200).json({
      message: "Profile image uploaded successfully!",
      imageUrl: customer.image,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Failed to upload profile image" });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.headers;
    const { username, email, contact_no } = req.body;

    const updateFields = {};
    if (username) updateFields.nuserame = username;
    if (email) updateFields.email = email;
    if (contact_no) updateFields.contact_no = contact_no;

    const data = await User.findByIdAndUpdate(id, updateFields, { new: true }); // { new: true }: Returns the updated document.

    res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).select(
      "username email contact_no image"
    );
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

module.exports = {
  findAll,
  save,
  findById,
  deleteById,
  update,
  uploadImage,
  uploadImages, //for web
  // updateProfile,
  getProfile,
};
// const Customer = require("../model/Customer");
// const nodemailer = require("nodemailer");

// //  Fetch All Customers
// const findAll = async (req, res) => {
//   try {
//     const customers = await Customer.find();
//     res.status(200).json(customers);
//   } catch (error) {
//     console.error("Fetch Customers Error:", error);
//     res.status(500).json({ message: "Failed to fetch customers" });
//   }
// };

// //  Register Customer + Send Email
// const save = async (req, res) => {
//   try {
//     const customer = new Customer(req.body);
//     await customer.save();

//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "manishaa8981@gmail.com",
//         pass: "dtebhpaccivhkhth",
//       },
//     });

//     await transporter.sendMail({
//       from: "manishaa8981@gmail.com",
//       to: customer.email,
//       subject: "Customer Registration",
//       html: `<h1>Your Registration has been Completed</h1>
//              <p>Your user ID is ${customer.id}</p>`,
//     });

//     res.status(201).json({ message: "Registration successful", customer });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

// //  Fetch Customer by ID
// const findById = async (req, res) => {
//   try {
//     const customer = await Customer.findById(req.params.id);
//     if (!customer) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(customer);
//   } catch (error) {
//     console.error("Find User Error:", error);
//     res.status(500).json({ message: "Failed to fetch user" });
//   }
// };

// //  Delete Customer by ID
// const deleteById = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndDelete(req.params.id);
//     if (!customer) return res.status(404).json({ message: "User not found" });

//     res.status(200).json({ message: "Customer deleted successfully" });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({ message: "Failed to delete customer" });
//   }
// };

// //  Update Customer by ID
// const update = async (req, res) => {
//   try {
//     const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!customer) return res.status(404).json({ message: "User not found" });

//     res
//       .status(200)
//       .json({ message: "Customer updated successfully", customer });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Failed to update customer" });
//   }
// };

// //  Upload Profile Image
// const uploadImages = async (req, res) => {
//   try {
//     if (!req.file)
//       return res.status(400).json({ message: "Please upload an image" });

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." });
//     }

//     const user = await Customer.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.image = `/uploads/images/${req.file.filename}`;
//     await user.save();

//     res
//       .status(200)
//       .json({
//         message: "Profile image uploaded successfully!",
//         imageUrl: user.image,
//       });
//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ message: "Failed to upload profile image" });
//   }
// };

// //  Update Profile (Username & Contact)
// const updateProfile = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." });
//     }

//     const { username, contact_no } = req.body;
//     const user = await Customer.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.username = username || user.username;
//     user.contact_no = contact_no || user.contact_no;

//     await user.save();
//     res.status(200).json({ message: "Profile updated successfully!", user });
//   } catch (error) {
//     console.error("Profile Update Error:", error);
//     res.status(500).json({ message: "Failed to update profile" });
//   }
// };

// //  Fetch User Profile (Excludes password)
// const getProfile = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized. Please log in." });
//     }

//     const customer = await Customer.findById(req.user.id).select("-password");
//     if (!customer) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(customer);
//   } catch (error) {
//     console.error("Profile Fetch Error:", error);
//     res.status(500).json({ message: "Failed to fetch profile" });
//   }
// };

// module.exports = {
//   findAll,
//   save,
//   findById,
//   deleteById,
//   update,
//   uploadImages,
//   updateProfile,
//   getProfile,
// };
