const express = require("express");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protectAdmin = require("../middleware/adminAuth");

const router = express.Router();

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Protected admin routes
router.post("/", protectAdmin, createCategory);
router.put("/:id", protectAdmin, updateCategory);
router.delete("/:id", protectAdmin, deleteCategory);

module.exports = router;