// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const SECRET_KEY =
//   "6801863cb1b653e57029ae63c6c2edf7c8b0d1848d20adb903d795e811d08f68";
// const Customer = require("../model/Customers");

// const register = async (req, res) => {
//   const { username, password, role } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const cred = new Customer({ username, password: hashedPassword, role });
//   cred.save();
//   res.status(201).send(cred);
// };

// const login = async (req, res) => {
//   const { username, password } = req.body;
//   const cred = await Customer.findOne({ username });
//   if (!cred || !(await bcrypt.compare(password, cred.password))) {
//     return res.status(403).send("Invalid username or password");
//   }

//   const token = jwt.sign(
//     { username: cred.username, role: cred.role },
//     SECRET_KEY,
//     { expiresIn: "1h" }
//   );
//   res.json({ token });
// };

// module.exports = {
//   login,
//   register,
// };

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY =
  "6801863cb1b653e57029ae63c6c2edf7c8b0d1848d20adb903d795e811d08f68";
const Customer = require("../model/Customer");

const register = async (req, res) => {
  try {
    const { username, password, role, email, image, contact_no } = req.body;

    // 🔹 Check if required fields are provided
    if (!username || !password || !email || !contact_no) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 🔹 Hash the password safely
    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = role || "customer";

    // 🔹 Create new user object
    const cred = new Customer({
      username,
      password: hashedPassword,
      email,
      contact_no,
      image,
      role: userRole,
    });

    // 🔹 Save user and wait for completion
    await cred.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: cred });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
  // const { username, password, role, email, image ,contact_no } = req.body;
  // const hashedPassword = await bcrypt.hash(password, 10);
  // const userRole = role || "customer";

  // const cred = new Customer({
  //   username,
  //   password: hashedPassword,
  //   email,
  //   contact_no,
  //   image,
  //   role: userRole,
  // });
  // cred.save();
  // res.status(201).send(cred);
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const cred = await Customer.findOne({ username });
  if (!cred || !(await bcrypt.compare(password, cred.password))) {
    return res.status(403).send("Invalid username or password");
  }

  const token = jwt.sign(
    { username: cred.username, role: cred.role },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
  res.json({ token, role: cred.role });
};

const loginMobile = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

  // Check if user exists
  const user = await Customer.findOne({ username }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  sendTokenResponse(user, 200, res);
};

const registerMobile = async (req, res, next) => {
  const user = await Customer.findOne({ username: req.body.username });
  console.log(req.body);
  if (user) {
    return res.status(400).send({ message: "User already exists" });
  }
  res.status(200).json({
    success: true,
    message: "User created successfully",
  });
};

module.exports = {
  login,
  register,
  loginMobile,
  registerMobile,
};
