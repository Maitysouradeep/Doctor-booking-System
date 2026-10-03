const express = require("express");
require("dotenv").config();

const dbconfig = require("./config/dbconfig");

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");
const queryRoute = require("./routes/queryRoute");
const queryAdminRoute = require("./routes/queryAdminRoute");
const app = express();

const port = process.env.PORT || 5000;

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());

// =========================
// API ROUTES
// =========================
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/query", queryRoute);
app.use("/api/admin/query", queryAdminRoute);
// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Doctor Booking API is running 🚀",
  });
});

// =========================
// 404 HANDLER
// =========================
app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "API route not found",
  });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((error, req, res, next) => {
  console.error("Global server error:", error);

  res.status(500).send({
    success: false,
    message: "Internal server error",
  });
});

// =========================
// START SERVER
// =========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});