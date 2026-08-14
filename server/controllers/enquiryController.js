const Enquiry = require("../models/Enquiry");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry was submitted successfully.",
      enquiry,
    });
  } catch (error) {
    console.error("Create enquiry error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateEnquiryStatus = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    enquiry.status = req.body.status || enquiry.status;

    await enquiry.save();

    res.status(200).json({
      success: true,
      message: "Enquiry status updated.",
      enquiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    await enquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};