const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/usermodel");
const authMiddlewares = require("../middlewares/authMiddlewares");

// =========================
// GET DOCTOR BY USER ID
// =========================
router.post(
  "/get-doctor-info-by-user-id",
  authMiddlewares,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({
        userId: req.userId,
      });

      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor profile not found",
        });
      }

      res.status(200).send({
        success: true,
        message: "Doctor data fetched successfully",
        data: doctor,
      });
    } catch (error) {
      console.error("Get doctor info error:", error);

      res.status(500).send({
        message: "Error getting doctor info",
        success: false,
        error: error.message,
      });
    }
  }
);

// =========================
// GET DOCTOR BY DOCTOR ID
// =========================
router.post(
  "/get-doctor-info-by-id",
  authMiddlewares,
  async (req, res) => {
    try {
      const { doctorId } = req.body;

      if (!doctorId) {
        return res.status(400).send({
          success: false,
          message: "Doctor ID is required",
        });
      }

      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor not found",
        });
      }

      res.status(200).send({
        success: true,
        message: "Doctor data fetched successfully",
        data: doctor,
      });
    } catch (error) {
      console.error("Get doctor by ID error:", error);

      res.status(500).send({
        message: "Error getting doctor info",
        success: false,
        error: error.message,
      });
    }
  }
);

// =========================
// UPDATE DOCTOR PROFILE
// =========================
router.post(
  "/update-doctor-profile",
  authMiddlewares,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOneAndUpdate(
        { userId: req.userId },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor profile not found",
        });
      }

      res.status(200).send({
        success: true,
        message: "Doctor profile updated successfully",
        data: doctor,
      });
    } catch (error) {
      console.error("Update doctor profile error:", error);

      res.status(500).send({
        message: "Error updating doctor info",
        success: false,
        error: error.message,
      });
    }
  }
);

// =========================
// GET DOCTOR APPOINTMENTS
// =========================
router.get(
  "/get-appointment-by-doctor-id",
  authMiddlewares,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({
        userId: req.userId,
      });

      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor profile not found",
        });
      }

      const appointments = await Appointment.find({
        doctorId: doctor._id,
      });

      res.status(200).send({
        message: "Appointments are fetched successfully",
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error("Get doctor appointments error:", error);

      res.status(500).send({
        message: "Error fetching appointments",
        success: false,
        error: error.message,
      });
    }
  }
);

// =========================
// CHANGE APPOINTMENT STATUS
// =========================
router.post(
  "/change-appointment-status",
  authMiddlewares,
  async (req, res) => {
    try {
      const { appointmentId, status } = req.body;

      if (!appointmentId || !status) {
        return res.status(400).send({
          success: false,
          message: "Appointment ID and status are required",
        });
      }

      const allowedStatuses = ["pending", "Approved", "Rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).send({
          success: false,
          message: "Invalid appointment status",
        });
      }

      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).send({
          success: false,
          message: "Appointment not found",
        });
      }

      // Make sure the logged-in doctor owns this appointment.
      const doctor = await Doctor.findOne({
        userId: req.userId,
      });

      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor profile not found",
        });
      }

      if (appointment.doctorId.toString() !== doctor._id.toString()) {
        return res.status(403).send({
          success: false,
          message: "You are not authorized to update this appointment",
        });
      }

      appointment.status = status;
      await appointment.save();

      const user = await User.findById(appointment.userId);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Patient account not found",
        });
      }

      if (!user.unseenNotification) {
        user.unseenNotification = [];
      }

      user.unseenNotification.push({
        type: "Appointment-status-changed",
        message: `Your appointment status has been ${status}`,
        onClickPath: "/appointment",
      });

      await user.save();

      res.status(200).send({
        success: true,
        message: "Appointment status updated successfully",
        data: appointment,
      });
    } catch (error) {
      console.error("Change appointment status error:", error);

      res.status(500).send({
        message: "Error changing appointment status",
        success: false,
        error: error.message,
      });
    }
  }
);

module.exports = router;