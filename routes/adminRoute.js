const express = require("express");
const router = express.Router();

const User = require("../models/usermodel");
const Doctor = require("../models/doctorModel");
const Query = require("../models/queryModel");
const authMiddlewares = require("../middlewares/authMiddlewares");

// =========================
// ADMIN AUTHORIZATION
// =========================
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isAdmin) {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).send({
      success: false,
      message: "Error checking admin access",
      error: error.message,
    });
  }
};

// =========================
// GET ALL DOCTORS
// =========================
router.get(
  "/get-all-doctors",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const doctors = await Doctor.find({});

      res.status(200).send({
        message: "Doctors are fetched successfully",
        success: true,
        data: doctors,
      });
    } catch (error) {
      console.error("Get all doctors error:", error);

      res.status(500).send({
        message: "Error fetching doctors",
        success: false,
        error: error.message,
      });
    }
  }
);

// =========================
// GET ALL USERS
// =========================
router.get(
  "/get-all-users",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find({ isAdmin: false }).select("-password");

      res.status(200).send({
        message: "Users are fetched successfully",
        success: true,
        data: users,
      });
    } catch (error) {
      console.error("Get all users error:", error);

      res.status(500).send({
        message: "Error fetching users",
        success: false,
        error: error.message,
      });
    }
  }
);

// =========================
// CHANGE DOCTOR ACCOUNT STATUS
// =========================
router.post(
  "/change-doctor-account-status",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const { doctorId, status } = req.body;

      if (!doctorId || !status) {
        return res.status(400).send({
          success: false,
          message: "Doctor ID and status are required",
        });
      }

      const allowedStatuses = ["Pending", "Approved", "Rejected"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).send({
          success: false,
          message: "Invalid doctor status",
        });
      }

      const doctor = await Doctor.findById(doctorId);

      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Doctor not found",
        });
      }

      doctor.status = status;
      doctor.isVerified = status === "Approved";

      await doctor.save();

      const user = await User.findById(doctor.userId);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Doctor user account not found",
        });
      }

      if (!user.unseenNotification) {
        user.unseenNotification = [];
      }

      user.unseenNotification.push({
        type: "doctor-request-changed",
        message: `Your doctor account has been ${status}`,
        onClickPath: "/notification",
      });

      user.isDoctor = status === "Approved";

      await user.save();

      res.status(200).send({
        success: true,
        message: "Doctor data updated successfully",
        data: doctor,
      });
    } catch (error) {
      console.error("Change doctor status error:", error);

      res.status(500).send({
        message: "Error updating doctor account",
        success: false,
        error: error.message,
      });
    }
  }
);

// =====================================================
// QUERY / SUPPORT SYSTEM
// =====================================================

// =========================
// GET ALL QUERIES
// =========================
router.get(
  "/get-all-queries",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const queries = await Query.find({}).sort({
        createdAt: -1,
      });

      res.status(200).send({
        success: true,
        message: "Queries fetched successfully",
        data: queries,
      });
    } catch (error) {
      console.error("Get all queries error:", error);

      res.status(500).send({
        success: false,
        message: "Error fetching queries",
        error: error.message,
      });
    }
  }
);

// =========================
// MARK QUERY AS VIEWED
// =========================
router.post(
  "/mark-query-viewed",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const { queryId } = req.body;

      if (!queryId) {
        return res.status(400).send({
          success: false,
          message: "Query ID is required",
        });
      }

      const query = await Query.findById(queryId);

      if (!query) {
        return res.status(404).send({
          success: false,
          message: "Query not found",
        });
      }

      if (query.status === "New") {
        query.status = "Viewed";
        await query.save();
      }

      res.status(200).send({
        success: true,
        message: "Query marked as viewed",
        data: query,
      });
    } catch (error) {
      console.error("Mark query viewed error:", error);

      res.status(500).send({
        success: false,
        message: "Error marking query as viewed",
        error: error.message,
      });
    }
  }
);

// =========================
// REPLY TO QUERY
// =========================
router.post(
  "/reply-to-query",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const { queryId, reply } = req.body;

      if (!queryId || !reply || !reply.trim()) {
        return res.status(400).send({
          success: false,
          message: "Query ID and reply are required",
        });
      }

      const query = await Query.findById(queryId);

      if (!query) {
        return res.status(404).send({
          success: false,
          message: "Query not found",
        });
      }

      query.reply = reply.trim();
      query.repliedAt = new Date();
      query.status = "Resolved";

      await query.save();

      res.status(200).send({
        success: true,
        message: "Reply sent successfully",
        data: query,
      });
    } catch (error) {
      console.error("Reply to query error:", error);

      res.status(500).send({
        success: false,
        message: "Error sending reply",
        error: error.message,
      });
    }
  }
);

// =========================
// RESOLVE QUERY WITHOUT REPLY
// =========================
router.post(
  "/resolve-query",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const { queryId } = req.body;

      if (!queryId) {
        return res.status(400).send({
          success: false,
          message: "Query ID is required",
        });
      }

      const query = await Query.findById(queryId);

      if (!query) {
        return res.status(404).send({
          success: false,
          message: "Query not found",
        });
      }

      query.status = "Resolved";

      await query.save();

      res.status(200).send({
        success: true,
        message: "Query resolved successfully",
        data: query,
      });
    } catch (error) {
      console.error("Resolve query error:", error);

      res.status(500).send({
        success: false,
        message: "Error resolving query",
        error: error.message,
      });
    }
  }
);

// =========================
// EXPORT ROUTER
// =========================
module.exports = router;