const express = require("express");
const router = express.Router();
const {
  getAllHalls,
  getHallById,
  createHall,
  updateHall,
  deleteHall,
  getHallsByMovieId,
} = require("../controller/HallController");
const { authenticateToken } = require("../security/Auth");

router.get("/", getAllHalls);
router.get("/:id", getHallById);
router.post("/", authenticateToken,createHall);
router.put("/:id", authenticateToken,updateHall);
router.delete("/:id",authenticateToken, deleteHall);
router.get("/movie/:movieId",authenticateToken, getHallsByMovieId);

module.exports = router;
