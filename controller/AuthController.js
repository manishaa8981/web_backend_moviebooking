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
  const { username, password, role, email, contact_no } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role || "customer";

  const cred = new Customer({
    username,
    password: hashedPassword,
    email,
    contact_no,
    role: userRole,
  });
  cred.save();
  res.status(201).send(cred);
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
    { expiresIn: "5h" }
  );
  res.json({ token, role: cred.role });
};

module.exports = {
  login,
  register,
};
