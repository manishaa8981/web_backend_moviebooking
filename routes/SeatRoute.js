const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  deleteById,
  update,
} = require("../controller/SeatController");
const { authenticateToken } = require("../security/Auth");

router.get("/get", findAll);
router.post("/save", authenticateToken, save);
router.delete("/:id", authenticateToken, deleteById);
router.put("/:id", authenticateToken, update);

module.exports = router;
