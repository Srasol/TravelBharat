const express = require("express");

const {
  createTouristPlace,
  getTouristPlaces,
  getTouristPlaceById,
  updateTouristPlace,
  deleteTouristPlace,
} = require("../controllers/touristPlaceController");

const upload = require("../middleware/upload");
const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Public routes
router.get("/", getTouristPlaces);
router.get("/:id", getTouristPlaceById);

// Protected admin routes
router.post(
  "/",
  protectAdmin,
  upload.array("images", 10),
  createTouristPlace
);

router.put(
  "/:id",
  protectAdmin,
  upload.array("images", 10),
  updateTouristPlace
);

router.delete("/:id", protectAdmin, deleteTouristPlace);

module.exports = router;