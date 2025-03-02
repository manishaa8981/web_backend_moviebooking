// const express = require("express");
// const router = express.Router();
// const {
//   findAll,
//   save,
//   findById,
//   deleteById,
//   update,
// } = require("../controller/ShowTimeController");
// const { authenticateToken } = require("../security/Auth");

// router.get("/get", findAll);
// router.post("/save", authenticateToken, save);
// router.get("/:id", findById);
// router.delete("/:id", authenticateToken, deleteById);
// router.put("/:id", authenticateToken, update);
// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAllShowTimes,
  getShowTimeById,
  createShowTime,
  updateShowTime,
  deleteShowTime,
  getShowtimesByMovie,
} = require("../controller/ShowTimeController");
const { authenticateToken } = require("../security/Auth");

router.get("/", getAllShowTimes);
router.get("/:id", getShowTimeById);
router.post("/",authenticateToken, createShowTime);
router.put("/:id",authenticateToken, updateShowTime);
router.delete("/:id",authenticateToken, deleteShowTime);
router.get("/movie/:movieId", getShowtimesByMovie);

module.exports = router;
