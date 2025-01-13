const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  findById,
  deleteById,
  update,
} = require("../controller/ShowTimeController");
const { authenticateToken } = require("../security/Auth");

router.get("/", findAll);
router.post("/", authenticateToken, save);
router.get("/:id", authenticateToken, findById);
router.delete("/:id", authenticateToken, deleteById);
router.put("/:id", authenticateToken, update);
module.exports = router;
