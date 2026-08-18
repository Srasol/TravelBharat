const TouristPlace = require("../models/TouristPlace");
const cloudinary = require("../config/cloudinary");

/* =========================================================
   CLOUDINARY HELPERS
========================================================= */

/*
  Upload one Multer memory buffer to Cloudinary.
*/
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
  Upload all files sent through Multer.
*/
const uploadFilesToCloudinary = async (
  files,
  folder
) => {
  if (!files || files.length === 0) {
    return [];
  }

  const results = await Promise.all(
    files.map((file) =>
      uploadBufferToCloudinary(
        file.buffer,
        folder
      )
    )
  );

  return results.map(
    (result) => result.secure_url
  );
};

/*
  If an old image is already a Cloudinary URL,
  optionally remove it when replacing images.
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

    /*
      Remove optional transformation/version parts.

      Example:
      v123456/travelbharat/places/image.jpg
    */
    const parts = uploadPart.split("/");

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

const deleteCloudinaryImages = async (
  imageUrls
) => {
  if (!Array.isArray(imageUrls)) {
    return;
  }

  const publicIds = imageUrls
    .map(getCloudinaryPublicId)
    .filter(Boolean);

  if (publicIds.length === 0) {
    return;
  }

  await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId)
    )
  );
};

/* =========================================================
   CREATE TOURIST PLACE
========================================================= */

exports.createTouristPlace = async (
  req,
  res
) => {
  try {
    const images =
      await uploadFilesToCloudinary(
        req.files,
        "travelbharat/places"
      );

    const nearbyAttractions =
      req.body.nearbyAttractions
        ? req.body.nearbyAttractions
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    const place =
      await TouristPlace.create({
        name: req.body.name,

        state: req.body.state,

        city: req.body.city,

        category: req.body.category,

        description:
          req.body.description,

        history:
          req.body.history || "",

        bestTime:
          req.body.bestTime || "",

        entryFee:
          req.body.entryFee || "",

        timings:
          req.body.timings || "",

        googleMap:
          req.body.googleMap || "",

        nearbyAttractions,

        images,
      });

    const populatedPlace =
      await TouristPlace.findById(
        place._id
      )
        .populate(
          "state",
          "name capital"
        )
        .populate(
          "city",
          "name"
        )
        .populate(
          "category",
          "name icon"
        );

    res.status(201).json({
      success: true,

      message:
        "Tourist place created successfully",

      place: populatedPlace,
    });
  } catch (error) {
    console.error(
      "Create tourist place error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to create tourist place.",
    });
  }
};

/* =========================================================
   GET ALL TOURIST PLACES
========================================================= */

exports.getTouristPlaces = async (
  req,
  res
) => {
  try {
    const filter = {};

    if (req.query.state) {
      filter.state = req.query.state;
    }

    if (req.query.city) {
      filter.city = req.query.city;
    }

    if (req.query.category) {
      filter.category =
        req.query.category;
    }

    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const places =
      await TouristPlace.find(filter)
        .populate(
          "state",
          "name capital"
        )
        .populate(
          "city",
          "name"
        )
        .populate(
          "category",
          "name icon"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,

      count: places.length,

      places,
    });
  } catch (error) {
    console.error(
      "Get tourist places error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to load tourist places.",
    });
  }
};

/* =========================================================
   GET SINGLE TOURIST PLACE
========================================================= */

exports.getTouristPlaceById = async (
  req,
  res
) => {
  try {
    const place =
      await TouristPlace.findById(
        req.params.id
      )
        .populate(
          "state",
          "name capital description image"
        )
        .populate(
          "city",
          "name description image"
        )
        .populate(
          "category",
          "name icon"
        );

    if (!place) {
      return res.status(404).json({
        success: false,

        message:
          "Tourist place not found",
      });
    }

    res.status(200).json({
      success: true,

      place,
    });
  } catch (error) {
    console.error(
      "Get tourist place error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to load tourist place.",
    });
  }
};

/* =========================================================
   UPDATE TOURIST PLACE
========================================================= */

exports.updateTouristPlace = async (
  req,
  res
) => {
  try {
    console.log("===== UPDATE PLACE DEBUG =====");
console.log("Place ID:", req.params.id);
console.log("Files received:", req.files?.length || 0);

if (req.files?.length > 0) {
  req.files.forEach((file, index) => {
    console.log(
      `File ${index + 1}:`,
      file.originalname,
      file.mimetype,
      file.size
    );
  });
}
    const place =
      await TouristPlace.findById(
        req.params.id
      );

    if (!place) {
      return res.status(404).json({
        success: false,

        message:
          "Tourist place not found",
      });
    }

    if (
      req.body.name !== undefined
    ) {
      place.name = req.body.name;
    }

    if (
      req.body.state !== undefined
    ) {
      place.state = req.body.state;
    }

    if (
      req.body.city !== undefined
    ) {
      place.city = req.body.city;
    }

    if (
      req.body.category !== undefined
    ) {
      place.category =
        req.body.category;
    }

    if (
      req.body.description !==
      undefined
    ) {
      place.description =
        req.body.description;
    }

    if (
      req.body.history !== undefined
    ) {
      place.history =
        req.body.history;
    }

    if (
      req.body.bestTime !== undefined
    ) {
      place.bestTime =
        req.body.bestTime;
    }

    if (
      req.body.entryFee !== undefined
    ) {
      place.entryFee =
        req.body.entryFee;
    }

    if (
      req.body.timings !== undefined
    ) {
      place.timings =
        req.body.timings;
    }

    if (
      req.body.googleMap !== undefined
    ) {
      place.googleMap =
        req.body.googleMap;
    }

    if (
      req.body.nearbyAttractions !==
      undefined
    ) {
      place.nearbyAttractions =
        req.body.nearbyAttractions
          ? req.body.nearbyAttractions
              .split(",")
              .map((item) =>
                item.trim()
              )
              .filter(Boolean)
          : [];
    }

    /*
      If new images were uploaded:
      1. Upload them to Cloudinary.
      2. Replace the old image array.
      3. Remove previous Cloudinary images.
    */
    if (
      req.files &&
      req.files.length > 0
    ) {
      const oldImages = [
        ...(place.images || []),
      ];

      const newImages =
        await uploadFilesToCloudinary(
          req.files,
          "travelbharat/places"
        );

      place.images = newImages;

      /*
        Old local URLs won't be deleted here.
        Only old Cloudinary assets will be removed.
      */
      await deleteCloudinaryImages(
        oldImages
      );
    }

    await place.save();

    const updatedPlace =
      await TouristPlace.findById(
        place._id
      )
        .populate(
          "state",
          "name capital"
        )
        .populate(
          "city",
          "name"
        )
        .populate(
          "category",
          "name icon"
        );

    res.status(200).json({
      success: true,

      message:
        "Tourist place updated successfully",

      place: updatedPlace,
    });
  } catch (error) {
    console.error(
      "Update tourist place error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to update tourist place.",
    });
  }
};

/* =========================================================
   DELETE TOURIST PLACE
========================================================= */

exports.deleteTouristPlace = async (
  req,
  res
) => {
  try {
    const place =
      await TouristPlace.findById(
        req.params.id
      );

    if (!place) {
      return res.status(404).json({
        success: false,

        message:
          "Tourist place not found",
      });
    }

    /*
      Delete Cloudinary assets belonging to
      this tourist place before deleting
      the MongoDB document.
    */
    await deleteCloudinaryImages(
      place.images || []
    );

    await place.deleteOne();

    res.status(200).json({
      success: true,

      message:
        "Tourist place deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete tourist place error:",
      error
    );

    res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to delete tourist place.",
    });
  }
};