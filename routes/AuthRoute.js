const express = require("express");
const router = express.Router();
const {
  login,
  register,
  forgotPassword,
  resetPassword,
} = require("../controller/AuthController");
const { authenticateToken } = require("../security/Auth");

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/loginMobile", login);
router.post("/registerMobile", register);
module.exports = router;
