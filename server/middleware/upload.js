const multer = require("multer");
const path = require("path");

/* =========================================================
   MEMORY STORAGE
========================================================= */

const storage =
  multer.memoryStorage();

/* =========================================================
   FILE FILTER
========================================================= */

const fileFilter = (
  req,
  file,
  callback
) => {
  const allowedExtensions =
    /jpeg|jpg|png|webp/;

  const extensionIsValid =
    allowedExtensions.test(
      path
        .extname(
          file.originalname
        )
        .toLowerCase()
    );

  const mimeTypeIsValid = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ].includes(file.mimetype);

  if (
    extensionIsValid &&
    mimeTypeIsValid
  ) {
    callback(null, true);
  } else {
    callback(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

/* =========================================================
   MULTER
========================================================= */

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});

module.exports = upload;