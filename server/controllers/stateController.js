const State = require("../models/State");
const cloudinary = require("../config/cloudinary");

/* =========================================================
   CLOUDINARY HELPERS
========================================================= */

const uploadBufferToCloudinary = (
  fileBuffer,
  folder
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",

          transformation: [
            {
              quality: "auto",
              fetch_format: "auto",
            },
          ],
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

/*
  Get Cloudinary public ID from a stored URL.
  Old local paths like uploads/abc.jpg
  are automatically ignored.
*/
const getCloudinaryPublicId = (imageUrl) => {
  if (
    !imageUrl ||
    !imageUrl.includes("res.cloudinary.com")
  ) {
    return null;
  }

  try {
    const withoutQuery =
      imageUrl.split("?")[0];

    const uploadPart =
      withoutQuery.split("/upload/")[1];

    if (!uploadPart) {
      return null;
    }

    const parts =
      uploadPart.split("/");

    const versionIndex =
      parts.findIndex((part) =>
        /^v\d+$/.test(part)
      );

    const usefulParts =
      versionIndex >= 0
        ? parts.slice(versionIndex + 1)
        : parts;

    const fullPath =
      usefulParts.join("/");

    return fullPath.replace(
      /\.[^/.]+$/,
      ""
    );
  } catch (error) {
    return null;
  }
};

const deleteCloudinaryImage = async (
  imageUrl
) => {
  const publicId =
    getCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(
      publicId
    );
  } catch (error) {
    console.error(
      "Cloudinary delete error:",
      error.message
    );
  }
};

/* =========================================================
   CREATE STATE
========================================================= */

exports.createState = async (
  req,
  res
) => {
  try {
    const existingState =
      await State.findOne({
        name: req.body.name,
      });

    if (existingState) {
      return res.status(400).json({
        success: false,
        message:
          "State already exists",
      });
    }

    let image = "";

    /*
      If image was selected,
      upload directly to Cloudinary.
    */
    if (req.file) {
      const result =
        await uploadBufferToCloudinary(
          req.file.buffer,
          "travelbharat/states"
        );

      image = result.secure_url;
    }

    const state =
      await State.create({
        name: req.body.name,

        capital:
          req.body.capital,

        description:
          req.body.description,

        image,
      });

    res.status(201).json({
      success: true,

      message:
        "State added successfully",

      state,
    });
  } catch (error) {
    console.error(
      "Create state error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to create state.",
    });
  }
};

/* =========================================================
   GET ALL STATES
========================================================= */

exports.getStates = async (
  req,
  res
) => {
  try {
    const states =
      await State.find().sort({
        name: 1,
      });

    res.status(200).json({
      success: true,

      count: states.length,

      states,
    });
  } catch (error) {
    console.error(
      "Get states error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to load states.",
    });
  }
};

/* =========================================================
   GET SINGLE STATE
========================================================= */

exports.getStateById = async (
  req,
  res
) => {
  try {
    const state =
      await State.findById(
        req.params.id
      );

    if (!state) {
      return res.status(404).json({
        success: false,

        message:
          "State not found",
      });
    }

    res.status(200).json({
      success: true,

      state,
    });
  } catch (error) {
    console.error(
      "Get state error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to load state.",
    });
  }
};

/* =========================================================
   UPDATE STATE
========================================================= */

exports.updateState = async (
  req,
  res
) => {
  try {
    const state =
      await State.findById(
        req.params.id
      );

    if (!state) {
      return res.status(404).json({
        success: false,

        message:
          "State not found",
      });
    }

    if (
      req.body.name !== undefined
    ) {
      state.name =
        req.body.name;
    }

    if (
      req.body.capital !== undefined
    ) {
      state.capital =
        req.body.capital;
    }

    if (
      req.body.description !==
      undefined
    ) {
      state.description =
        req.body.description;
    }

    /*
      New image selected:
      1. Upload new image to Cloudinary
      2. Replace image URL
      3. Delete old Cloudinary image

      Old local uploads/... images
      are not deleted automatically.
    */
    if (req.file) {
      const oldImage =
        state.image;

      const result =
        await uploadBufferToCloudinary(
          req.file.buffer,
          "travelbharat/states"
        );

      state.image =
        result.secure_url;

      await deleteCloudinaryImage(
        oldImage
      );
    }

    const updatedState =
      await state.save();

    res.status(200).json({
      success: true,

      message:
        "State updated successfully",

      state: updatedState,
    });
  } catch (error) {
    console.error(
      "Update state error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to update state.",
    });
  }
};

/* =========================================================
   DELETE STATE
========================================================= */

exports.deleteState = async (
  req,
  res
) => {
  try {
    const state =
      await State.findById(
        req.params.id
      );

    if (!state) {
      return res.status(404).json({
        success: false,

        message:
          "State not found",
      });
    }

    /*
      If the image is stored in Cloudinary,
      remove the Cloudinary asset first.
    */
    await deleteCloudinaryImage(
      state.image
    );

    await state.deleteOne();

    res.status(200).json({
      success: true,

      message:
        "State deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete state error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to delete state.",
    });
  }
};