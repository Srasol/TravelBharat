const City = require("../models/City");
const State = require("../models/State");

exports.createCity = async (req, res) => {
  try {
    const state = await State.findById(req.body.state);

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const existingCity = await City.findOne({
      name: req.body.name,
      state: req.body.state,
    });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message: "City already exists in this state",
      });
    }

    const city = await City.create({
      state: req.body.state,
      name: req.body.name,
      description: req.body.description,
      image: req.file ? `uploads/${req.file.filename}` : "",
    });

    const populatedCity = await City.findById(city._id).populate(
      "state",
      "name capital"
    );

    res.status(201).json({
      success: true,
      message: "City added successfully",
      city: populatedCity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCities = async (req, res) => {
  try {
    const filter = {};

    if (req.query.state) {
      filter.state = req.query.state;
    }

    const cities = await City.find(filter)
      .populate("state", "name capital")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCityById = async (req, res) => {
  try {
    const city = await City.findById(req.params.id).populate(
      "state",
      "name capital"
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    if (req.body.state) {
      const state = await State.findById(req.body.state);

      if (!state) {
        return res.status(404).json({
          success: false,
          message: "State not found",
        });
      }

      city.state = req.body.state;
    }

    city.name = req.body.name || city.name;
    city.description = req.body.description || city.description;

    if (req.file) {
      city.image = `uploads/${req.file.filename}`;
    }

    await city.save();

    const updatedCity = await City.findById(city._id).populate(
      "state",
      "name capital"
    );

    res.status(200).json({
      success: true,
      message: "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const city = await City.findById(req.params.id);

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    await city.deleteOne();

    res.status(200).json({
      success: true,
      message: "City deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};