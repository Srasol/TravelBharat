const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
} = require("../controllers/adminAuthController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", protectAdmin, getCurrentAdmin);

module.exports = router;