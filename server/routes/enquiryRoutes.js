const express = require("express");

const {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Public route
router.post("/", createEnquiry);

// Protected admin routes
router.get("/", protectAdmin, getEnquiries);
router.put("/:id/status", protectAdmin, updateEnquiryStatus);
router.delete("/:id", protectAdmin, deleteEnquiry);

module.exports = router;