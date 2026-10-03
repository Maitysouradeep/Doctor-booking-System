const express = require("express");
const router = express.Router();

const Query = require("../models/queryModel");
const User = require("../models/usermodel");
const authMiddlewares = require("../middlewares/authMiddlewares");

// CREATE QUERY
router.post(
  "/create-query",
  authMiddlewares,
  async (req, res) => {
    try {
      const { role, question } = req.body;

      if (!role || !question) {
        return res.status(400).send({
          success: false,
          message: "Role and question are required",
        });
      }

      if (!["patient", "doctor"].includes(role)) {
        return res.status(400).send({
          success: false,
          message: "Invalid user role",
        });
      }

      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      const newQuery = await Query.create({
        userId: user._id.toString(),
        userName: user.name,
        userEmail: user.email,
        role,
        question: question.trim(),
      });

      res.status(201).send({
        success: true,
        message: "Your query has been submitted successfully",
        data: newQuery,
      });
    } catch (error) {
      console.error("Create query error:", error);

      res.status(500).send({
        success: false,
        message: "Error submitting query",
        error: error.message,
      });
    }
  }
);


// GET LOGGED-IN USER'S QUERIES
router.get(
  "/my-queries",
  authMiddlewares,
  async (req, res) => {
    try {
      const queries = await Query.find({
        userId: req.userId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).send({
        success: true,
        message: "Your queries fetched successfully",
        data: queries,
      });
    } catch (error) {
      console.error("Get my queries error:", error);

      res.status(500).send({
        success: false,
        message: "Error fetching your queries",
        error: error.message,
      });
    }
  }
);


module.exports = router;