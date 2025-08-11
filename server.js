const express = require('express');
const app = express();
require('dotenv').config();
const dbconfig = require('./config/dbconfig');

app.use(express.json());

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");

const port = process.env.PORT || 5000;

// API Routes
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);

// Root route for testing
app.get("/", (req, res) => {
    res.send("Doctor Booking API is running 🚀");
});

app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`🚀 Server running at ${url}`);
});




