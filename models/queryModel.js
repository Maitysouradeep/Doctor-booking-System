const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["patient", "doctor"],
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },
     reply: {
      type: String,
      default: "",
      trim: true,
    },

    repliedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["New", "Viewed", "Resolved"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const queryModel = mongoose.model("queries", querySchema);

module.exports = queryModel;