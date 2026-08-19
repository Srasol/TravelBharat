const City = require("../models/City");
const State = require("../models/State");
const cloudinary = require("../config/cloudinary");

/* =========================================================
   UPLOAD IMAGE BUFFER TO CLOUDINARY
========================================================= */

const uploadImageToCloudinary = (
  fileBuffer,
  folder = "travelbharat/cities"
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    uploadStream.end(fileBuffer);
  });
};

/* =========================================================
   CREATE CITY
========================================================= */

exports.createCity = async (req, res) => {
  try {
    const {
      state,
      name,
      description,
    } = req.body;

    /* VALIDATION */

    if (
      !state ||
      !name?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "State, city name and description are required",
      });
    }

    /* CHECK STATE */

    const existingState =
      await State.findById(state);

    if (!existingState) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    /* CHECK DUPLICATE */

    const existingCity =
      await City.findOne({
        name: name.trim(),
        state,
      });

    if (existingCity) {
      return res.status(400).json({
        success: false,
        message:
          "City already exists in this state",
      });
    }

    /* ===============================================
       UPLOAD IMAGE TO CLOUDINARY
    =============================================== */

    let imageUrl = "";

    if (req.file) {
      const uploadResult =
        await uploadImageToCloudinary(
          req.file.buffer
        );

      imageUrl =
        uploadResult.secure_url;
    }

    /* CREATE CITY */

    const city = await City.create({
      state,
      name: name.trim(),
      description:
        description.trim(),
      image: imageUrl,
    });

    /* POPULATE STATE */

    const populatedCity =
      await City.findById(
        city._id
      ).populate(
        "state",
        "name capital"
      );

    return res.status(201).json({
      success: true,
      message:
        "City added successfully",
      city: populatedCity,
    });
  } catch (error) {
    console.error(
      "Create city error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create city",
    });
  }
};

/* =========================================================
   GET ALL CITIES
========================================================= */

exports.getCities = async (
  req,
  res
) => {
  try {
    const filter = {};

    if (req.query.state) {
      filter.state =
        req.query.state;
    }

    const cities =
      await City.find(filter)
        .populate(
          "state",
          "name capital"
        )
        .sort({
          name: 1,
        });

    return res.status(200).json({
      success: true,
      count: cities.length,
      cities,
    });
  } catch (error) {
    console.error(
      "Get cities error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load cities",
    });
  }
};

/* =========================================================
   GET CITY BY ID
========================================================= */

exports.getCityById = async (
  req,
  res
) => {
  try {
    const city =
      await City.findById(
        req.params.id
      ).populate(
        "state",
        "name capital"
      );

    if (!city) {
      return res.status(404).json({
        success: false,
        message:
          "City not found",
      });
    }

    return res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    console.error(
      "Get city error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load city",
    });
  }
};

/* =========================================================
   UPDATE CITY
========================================================= */

exports.updateCity = async (
  req,
  res
) => {
  try {
    const city =
      await City.findById(
        req.params.id
      );

    if (!city) {
      return res.status(404).json({
        success: false,
        message:
          "City not found",
      });
    }

    /* ===============================================
       UPDATE STATE
    =============================================== */

    if (req.body.state) {
      const state =
        await State.findById(
          req.body.state
        );

      if (!state) {
        return res.status(404).json({
          success: false,
          message:
            "State not found",
        });
      }

      city.state =
        req.body.state;
    }

    /* ===============================================
       UPDATE TEXT
    =============================================== */

    if (
      req.body.name &&
      req.body.name.trim()
    ) {
      city.name =
        req.body.name.trim();
    }

    if (
      req.body.description &&
      req.body.description.trim()
    ) {
      city.description =
        req.body.description.trim();
    }

    /* ===============================================
       NEW IMAGE
    =============================================== */

    if (req.file) {
      const uploadResult =
        await uploadImageToCloudinary(
          req.file.buffer
        );

      city.image =
        uploadResult.secure_url;
    }

    /* SAVE */

    await city.save();

    /* POPULATE */

    const updatedCity =
      await City.findById(
        city._id
      ).populate(
        "state",
        "name capital"
      );

    return res.status(200).json({
      success: true,
      message:
        "City updated successfully",
      city: updatedCity,
    });
  } catch (error) {
    console.error(
      "Update city error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update city",
    });
  }
};

/* =========================================================
   DELETE CITY
========================================================= */

exports.deleteCity = async (
  req,
  res
) => {
  try {
    const city =
      await City.findById(
        req.params.id
      );

    if (!city) {
      return res.status(404).json({
        success: false,
        message:
          "City not found",
      });
    }

    await city.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "City deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete city error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete city",
    });
  }
};