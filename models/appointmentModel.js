const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    doctorId: {
      type: String,
      required: true,
      trim: true,
    },

    doctorInfo: {
      type: Object,
      required: true,
    },

    userInfo: {
      type: Object,
      required: true,
    },

    date: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "Approved", "Rejected"],
    },
  },
  {
    timestamps: true,
  }
);

const appointmentModel = mongoose.model(
  "appointment",
  appointmentSchema
);

module.exports = appointmentModel;