require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const stateRoutes = require("./routes/stateRoutes");
const cityRoutes = require("./routes/cityRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const touristPlaceRoutes = require("./routes/touristPlaceRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/places", touristPlaceRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TravelBharat API Running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();