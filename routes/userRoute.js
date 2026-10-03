const express = require("express");
const router = express.Router();

const User = require("../models/usermodel");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const authMiddlewares = require("../middlewares/authMiddlewares");

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Name, email and password are required",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(200).send({
        message: "User already exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).send({
      message: "Error creating user",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).send({
        message: "Email and password are required",
        success: false,
      });
    }

    // Escape regex characters so the email cannot alter the regex.
    const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const user = await User.findOne({
      email: {
        $regex: `^${escapedEmail}$`,
        $options: "i",
      },
    }).select("+password");

    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(200).send({
        message: "Password is incorrect",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).send({
      message: "Login successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).send({
      message: "Login failed",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// GET CURRENT USER
// =========================
router.post("/get-user-info-by-id", authMiddlewares, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).send({
        message: "User does not exist",
        success: false,
      });
    }

    res.status(200).send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get user info error:", error);

    res.status(500).send({
      message: "Error getting user info",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// APPLY AS DOCTOR
// =========================
router.post("/apply-doctor-account", authMiddlewares, async (req, res) => {
  try {
    const newdoctor = new Doctor({
      ...req.body,

      // Always use the authenticated user's ID.
      userId: req.userId,

      status: "Pending",
      isVerified: false,
    });

    await newdoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });

    if (!adminUser) {
      return res.status(404).send({
        success: false,
        message: "Admin user not found",
      });
    }

    if (!adminUser.unseenNotification) {
      adminUser.unseenNotification = [];
    }

    adminUser.unseenNotification.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: `${newdoctor.firstName} ${newdoctor.lastName}`,
      },
      onClickPath: "/admin/doctorslist",
    });

    await adminUser.save();

    res.status(200).send({
      success: true,
      message: "Doctor account applied successfully",
    });
  } catch (error) {
    console.error("Apply doctor error:", error);

    res.status(500).send({
      success: false,
      message: "Error applying doctor account",
      error: error.message,
    });
  }
});

// =========================
// MARK ALL NOTIFICATIONS AS SEEN
// =========================
router.post(
  "/mark-all-notification-as-seen",
  authMiddlewares,
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      if (user.unseenNotification?.length) {
        user.seenNotification.push(...user.unseenNotification);
      }

      user.unseenNotification = [];

      await user.save();

      const userData = user.toObject();
      delete userData.password;

      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: userData,
      });
    } catch (error) {
      console.error("Mark notifications as seen error:", error);

      res.status(500).send({
        message: "Error marking notifications as seen",
        success: false,
        error: error.message,
      });
    }
  },
);

// =========================
// DELETE ALL NOTIFICATIONS
// =========================
router.post("/delete-all-notification", authMiddlewares, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.seenNotification = [];
    user.unseenNotification = [];

    await user.save();

    const userData = user.toObject();
    delete userData.password;

    res.status(200).send({
      success: true,
      message: "All notifications are removed",
      data: userData,
    });
  } catch (error) {
    console.error("Delete notifications error:", error);

    res.status(500).send({
      message: "Error deleting notifications",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// GET ALL APPROVED DOCTORS
// =========================
router.get("/get-all-approved-doctors", authMiddlewares, async (req, res) => {
  try {
    const doctors = await Doctor.find({
      status: "Approved",
    });

    res.status(200).send({
      message: "Doctors are fetched successfully",
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.error("Get approved doctors error:", error);

    res.status(500).send({
      message: "Error fetching doctors",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// BOOK APPOINTMENT
// =========================
router.post("/book-appointment", authMiddlewares, async (req, res) => {
  try {
    const { doctorId, doctorInfo, userInfo, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).send({
        message: "Doctor, date and time are required",
        success: false,
      });
    }

    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }

    const newAppointment = new Appointment({
      ...req.body,

      // Never trust userId from the frontend.
      userId: req.userId,

      doctorId: doctor._id,

      status: "pending",

      date: moment(date, "DD-MM-YYYY").toISOString(),
      time: moment(time, "HH:mm").toISOString(),

      doctorInfo,
      userInfo,
    });

    await newAppointment.save();

    const doctorUser = await User.findById(doctor.userId);

    if (!doctorUser) {
      return res.status(404).send({
        message: "Doctor user account not found",
        success: false,
      });
    }

    if (!doctorUser.unseenNotification) {
      doctorUser.unseenNotification = [];
    }

    doctorUser.unseenNotification.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${userInfo?.name || "a patient"}`,
      onClickPath: "/doctor/appointment",
    });

    await doctorUser.save();

    res.status(200).send({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.error("Book appointment error:", error);

    res.status(500).send({
      message: "Error booking appointment",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// CHECK BOOKING AVAILABILITY
// =========================
router.post(
  "/check-booking-availability",
  authMiddlewares,
  async (req, res) => {
    try {
      const { date: appointmentDate, time, doctorId } = req.body;

      if (!appointmentDate || !time || !doctorId) {
        return res.status(400).send({
          message: "Doctor, date and time are required",
          success: false,
        });
      }

      const date = moment(appointmentDate, "DD-MM-YYYY").toISOString();

      const fromTime = moment(time, "HH:mm").subtract(1, "hours").toISOString();

      const toTime = moment(time, "HH:mm").add(1, "hours").toISOString();

      const appointments = await Appointment.find({
        doctorId,
        date,
        time: {
          $gte: fromTime,
          $lte: toTime,
        },
      });

      if (appointments.length > 0) {
        return res.status(200).send({
          message: "Appointment slot not available",
          success: false,
        });
      }

      return res.status(200).send({
        message: "Appointment slot available",
        success: true,
      });
    } catch (error) {
      console.error("Check booking availability error:", error);

      res.status(500).send({
        message: "Error checking appointment availability",
        success: false,
        error: error.message,
      });
    }
  },
);

// =========================
// GET USER APPOINTMENTS
// =========================
router.get("/get-appointment-by-user-id", authMiddlewares, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      userId: req.userId,
    });

    res.status(200).send({
      message: "Appointments are fetched successfully",
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error("Get user appointments error:", error);

    res.status(500).send({
      message: "Error fetching appointments",
      success: false,
      error: error.message,
    });
  }
});

// =========================
// EXPORT ROUTER
// =========================
module.exports = router;
