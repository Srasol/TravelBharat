const mongoose = require("mongoose");

const touristPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    history: {
      type: String,
      default: "",
    },

    bestTime: {
      type: String,
      default: "",
    },

    entryFee: {
      type: String,
      default: "",
    },

    timings: {
      type: String,
      default: "",
    },

    googleMap: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    nearbyAttractions: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TouristPlace",
  touristPlaceSchema
);