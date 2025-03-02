const bcrypt = require("bcryptjs");
const Customer = require("../model/Customer");
const {
  sendRegistrationEmail,
  sendResetPasswordEmail,
} = require("../config/emailService");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

const register = async (req, res) => {
  try {
    const { username, password, role, email, image, contact_no } = req.body;

    if (!username || !password || !email || !contact_no) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || "customer";

    const cred = new Customer({
      username,
      password: hashedPassword,
      email,
      contact_no,
      image,
      role: userRole,
    });

    await cred.save();

    // Send registration email
    await sendRegistrationEmail(email, username);

    res
      .status(201)
      .json({ message: "User registered successfully", user: cred });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password Route
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Customer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Generate JWT Reset Token (valid for 15 minutes)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    //  Send Reset Email with JWT Token
    // const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reset Password Route
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    //  Verify JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    //  Find user by decoded ID
    const user = await Customer.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //  Hash New Password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const customer = await Customer.findOne({ username });

    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //  Generate JWT token (without customerId)
    const token = jwt.sign(
      {
        username: customer.username,
        email: customer.email,
        role: customer.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    //  Send customerId separately in the response
    res.status(200).json({
      message: "Login successful",
      token,
      role: customer.role,
      customerId: customer._id, //  Send this separately
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginMobile = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide a username and password" });
  }

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
  forgotPassword,
  resetPassword,
};
