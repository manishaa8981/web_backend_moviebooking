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
router.post("/", createHall);
router.put("/:id", updateHall);
router.delete("/:id", deleteHall);
router.get("/movie/:movieId", getHallsByMovieId);

module.exports = router;
