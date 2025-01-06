const express = require("express");
const router = express.Router();
const {
  save,
  deleteById,
  update,
} = require("../controller/LocationController");
const { authenticateToken } = require("../security/Auth");

router.post("/", authenticateToken, save);
router.delete("/:id", authenticateToken, deleteById);
router.put("/:id", authenticateToken, update);
module.exports = router;
