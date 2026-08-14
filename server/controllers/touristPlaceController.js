const TouristPlace = require("../models/TouristPlace");

// Create Tourist Place
exports.createTouristPlace = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map((file) => `uploads/${file.filename}`)
      : [];

    const nearbyAttractions = req.body.nearbyAttractions
      ? req.body.nearbyAttractions
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const place = await TouristPlace.create({
      name: req.body.name,
      state: req.body.state,
      city: req.body.city,
      category: req.body.category,
      description: req.body.description,
      history: req.body.history || "",
      bestTime: req.body.bestTime || "",
      entryFee: req.body.entryFee || "",
      timings: req.body.timings || "",
      googleMap: req.body.googleMap || "",
      nearbyAttractions,
      images,
    });

    const populatedPlace = await TouristPlace.findById(place._id)
      .populate("state", "name capital")
      .populate("city", "name")
      .populate("category", "name icon");

    res.status(201).json({
      success: true,
      message: "Tourist place created successfully",
      place: populatedPlace,
    });
  } catch (error) {
    console.error("Create tourist place error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Tourist Places
exports.getTouristPlaces = async (req, res) => {
  try {
    const filter = {};

    if (req.query.state) {
      filter.state = req.query.state;
    }

    if (req.query.city) {
      filter.city = req.query.city;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const places = await TouristPlace.find(filter)
      .populate("state", "name capital")
      .populate("city", "name")
      .populate("category", "name icon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: places.length,
      places,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Tourist Place
exports.getTouristPlaceById = async (req, res) => {
  try {
    const place = await TouristPlace.findById(req.params.id)
      .populate("state", "name capital description image")
      .populate("city", "name description image")
      .populate("category", "name icon");

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Tourist place not found",
      });
    }

    res.status(200).json({
      success: true,
      place,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Tourist Place
exports.updateTouristPlace = async (req, res) => {
  try {
    const place = await TouristPlace.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Tourist place not found",
      });
    }

    if (req.body.name) place.name = req.body.name;
    if (req.body.state) place.state = req.body.state;
    if (req.body.city) place.city = req.body.city;
    if (req.body.category) place.category = req.body.category;
    if (req.body.description) place.description = req.body.description;
    if (req.body.history) place.history = req.body.history;
    if (req.body.bestTime) place.bestTime = req.body.bestTime;
    if (req.body.entryFee) place.entryFee = req.body.entryFee;
    if (req.body.timings) place.timings = req.body.timings;
    if (req.body.googleMap) place.googleMap = req.body.googleMap;

    if (req.body.nearbyAttractions) {
      place.nearbyAttractions = req.body.nearbyAttractions
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (req.files && req.files.length > 0) {
      place.images = req.files.map(
        (file) => `uploads/${file.filename}`
      );
    }

    await place.save();

    const updatedPlace = await TouristPlace.findById(place._id)
      .populate("state", "name capital")
      .populate("city", "name")
      .populate("category", "name icon");

    res.status(200).json({
      success: true,
      message: "Tourist place updated successfully",
      place: updatedPlace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Tourist Place
exports.deleteTouristPlace = async (req, res) => {
  try {
    const place = await TouristPlace.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Tourist place not found",
      });
    }

    await place.deleteOne();

    res.status(200).json({
      success: true,
      message: "Tourist place deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};