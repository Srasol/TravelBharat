const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("City", citySchema);