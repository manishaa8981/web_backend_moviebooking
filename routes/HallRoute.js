const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  findById,
  deleteById,
  update,
} = require("../controller/HallController");
const { authenticateToken } = require("../security/Auth");

router.get("/get", findAll);
router.post("/save", authenticateToken, save);
router.get("/:id", authenticateToken, findById);
router.delete("/:id", authenticateToken, deleteById);
router.put("/:id", authenticateToken, update);
module.exports = router;
