const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  findById,
  deleteById,
  update,
  userbooking,
} = require("../controller/BookingController");
const { authenticateToken } = require("../security/Auth");

router.get("/", findAll);
router.post("/", authenticateToken, save);
router.get("/:id", authenticateToken, findById);
router.delete("/:id", authenticateToken, deleteById);
router.put("/:id", authenticateToken, update);
// router.put("/bookings/:bookingId", userbooking);
router.put("/:id/user", authenticateToken, userbooking);

module.exports = router;
