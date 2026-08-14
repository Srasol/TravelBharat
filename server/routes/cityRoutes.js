const express = require("express");

const {
  createCity,
  getCities,
  getCityById,
  updateCity,
  deleteCity,
} = require("../controllers/cityController");

const upload = require("../middleware/upload");
const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Public routes
router.get("/", getCities);
router.get("/:id", getCityById);

// Protected admin routes
router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createCity
);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  updateCity
);

router.delete("/:id", protectAdmin, deleteCity);

module.exports = router;