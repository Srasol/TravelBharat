const express = require("express");

const {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
} = require("../controllers/stateController");

const upload = require("../middleware/upload");
const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Public routes
router.get("/", getStates);
router.get("/:id", getStateById);

// Protected admin routes
router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createState
);

router.put(
  "/:id",
  protectAdmin,
  upload.single("image"),
  updateState
);

router.delete("/:id", protectAdmin, deleteState);

module.exports = router;