const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (
      !authorizationHeader ||
      !authorizationHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Admin authorization token is required.",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const admin = await Admin.findById(decoded.id).select(
      "-password"
    );

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found.",
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

module.exports = protectAdmin;