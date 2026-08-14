const State = require("../models/State");

// Add State
exports.createState = async (req, res) => {
  try {
    const existingState = await State.findOne({
      name: req.body.name,
    });

    if (existingState) {
      return res.status(400).json({
        success: false,
        message: "State already exists",
      });
    }

    const state = await State.create({
      name: req.body.name,
      capital: req.body.capital,
      description: req.body.description,
      image: req.file ? `uploads/${req.file.filename}` : "",
    });

    res.status(201).json({
      success: true,
      message: "State added successfully",
      state,
    });
  } catch (error) {
    console.error("Create state error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All States
exports.getStates = async (req, res) => {
  try {
    const states = await State.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: states.length,
      states,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single State
exports.getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    res.status(200).json({
      success: true,
      state,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update State
exports.updateState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    state.name = req.body.name || state.name;
    state.capital = req.body.capital || state.capital;
    state.description = req.body.description || state.description;

    if (req.file) {
      state.image = `uploads/${req.file.filename}`;
    }

    const updatedState = await state.save();

    res.status(200).json({
      success: true,
      message: "State updated successfully",
      state: updatedState,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete State
exports.deleteState = async (req, res) => {
  try {
    const state = await State.findById(req.params.id);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    await state.deleteOne();

    res.status(200).json({
      success: true,
      message: "State deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};