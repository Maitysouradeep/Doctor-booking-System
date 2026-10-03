const express = require("express");
const router = express.Router();

const Query = require("../models/queryModel");
const User = require("../models/usermodel");
const authMiddlewares = require("../middlewares/authMiddlewares");

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
    });
  }
};


/* GET ALL QUERIES */

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


/* CHANGE QUERY STATUS */

router.post(
  "/change-query-status",
  authMiddlewares,
  adminMiddleware,
  async (req, res) => {
    try {
      const { queryId, status } = req.body;

      if (!queryId || !status) {
        return res.status(400).send({
          success: false,
          message: "Query ID and status are required",
        });
      }

      const allowedStatuses = [
        "New",
        "Viewed",
        "Resolved",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).send({
          success: false,
          message: "Invalid query status",
        });
      }

      const query = await Query.findById(queryId);

      if (!query) {
        return res.status(404).send({
          success: false,
          message: "Query not found",
        });
      }

      query.status = status;

      await query.save();

      res.status(200).send({
        success: true,
        message: "Query status updated successfully",
        data: query,
      });
    } catch (error) {
      console.error("Change query status error:", error);

      res.status(500).send({
        success: false,
        message: "Error changing query status",
        error: error.message,
      });
    }
  }
);

module.exports = router;