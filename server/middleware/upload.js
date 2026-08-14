const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000) +
      path.extname(file.originalname);

    callback(null, uniqueName);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extension && mimeType) {
    callback(null, true);
  } else {
    callback(new Error("Only JPG, JPEG, PNG and WEBP images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;