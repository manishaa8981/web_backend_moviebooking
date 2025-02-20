// const express = require("express");
// const router = express.Router();
// const {
//   findAll,
//   save,
//   findById,
//   deleteById,
//   update,
// } = require("../controller/MovieController");
// const { authenticateToken } = require("../security/Auth");
// const upload = require("../config/multerConfig");

// router.get("/get", findAll);
// router.post("/save",authenticateToken, upload.single("movie_image"), save);
// router.get("/:id", authenticateToken, findById);
// router.delete("/:id", authenticateToken, deleteById);
// router.put("/:id", authenticateToken, update);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  findAll,
  save,
  findById,
  deleteById,
  update,
} = require("../controller/MovieController");
const { authenticateToken } = require("../security/Auth");
const upload = require("../config/multerConfig");

router.get("/", findAll);
router.post("/", upload.single("movie_image", save), authenticateToken, save);
router.get("/:id", findById);
router.delete("/:id", deleteById);
router.put("/:id", update);

module.exports = router;
