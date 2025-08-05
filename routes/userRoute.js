const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddlewares = require("../middlewares/authMiddlewares");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");

router.post("/register", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Registration error:", error); // Log full error in terminal
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).send({
        message: "Login successfully",
        success: true,
        data: token,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Login Failed", sucess: false, error });
  }
});

router.post("/get-user-info-by-id", authMiddlewares, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting user info", success: false, error });
  }
});
router.post("/apply-doctor-account", authMiddlewares, async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "Pending" });
    await newdoctor.save();
    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotification = adminUser.unseenNotification;
    unseenNotification.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName}${newdoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + "  " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctorslist",
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotification });
    res.status(200).send({
      success: true,
      message: "doctor account applied successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post(
  "/mark-all-notification-as-seen",
  authMiddlewares,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      const unseenNotification = user.unseenNotification;
      const seenNotification = user.seenNotification;
      user.seenNotification = unseenNotification;
      seenNotification.push(...unseenNotification);
      user.unseenNotification = [];
      user.seenNotification = user.seenNotification;
      const updatedUser = await user.save();
      updatedUser.password = undefined;
      res.status(200).send({
        success: true,
        message: "All notifications marked as seen",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).send({
        message: "Error applying doctor account",
        success: false,
        error,
      });
    }
  }
);

router.post("/delete-all-notification", authMiddlewares, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    user.seenNotification = [];
    user.unseenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications are removed",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.get("/get-all-approved-doctors", authMiddlewares, async (req, res) => {
  try {
    const doctor = await Doctor.find({ status: "Approved" });
    res.status(200).send({
      message: "Doctors are fetched successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
});

router.post("/book-appointment", authMiddlewares, async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date=moment(req.body.date,'DD-MM-YYYY').toISOString();
    req.body.time=moment(req.body.time,'HH:mm').toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    //push notific to doctor based on his user id
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unseenNotification.push({
      type: "new-appointment-request",
      message: `A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment booked successfully ",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error booking a appointment",
      success: false,
      error,
    });
  }
});

router.post(
  "/check-booking-availability",
  authMiddlewares,
  async (req, res) => {
    try {
      const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
      const fromTime = moment(req.body.time, "HH:mm")
        .subtract(1,'hours')
        .toISOString();
      const toTime = moment(req.body.time, "HH:mm")
        .add(1, 'hours')
        .toISOString();
      const doctorId = req.body.doctorId;
      const appointment = await Appointment.find({
        doctorId,
        date,
        time: { $gte: fromTime, $lte: toTime },
      });
      if (appointment.length > 0) {
        return res.status(200).send({
          message: "Appointment slot not available",
          success: false,
        });
      } else {
        return res.status(200).send({
          message: "Appointment slot available",
          success: true,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error booking a appointment",
        success: false,
        error,
      });
    }
  }
);

router.get("/get-appointment-by-user-id", authMiddlewares, async (req, res) => {
  try {
    const appointment = await Appointment.find({userId:req.userId});
    res.status(200).send({
      message: "Appointment are fetched successfully",
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({
      message: "Error fetching Appointment",
      success: false,
      error,
    });
  }
});
module.exports = router;
