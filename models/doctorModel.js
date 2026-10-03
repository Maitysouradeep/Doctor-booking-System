const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNo: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    feeForconsult: {
      type: Number,
      required: true,
      min: 0,
    },

    timings: {
      type: [String],
      required: true,
    },

    profilePic: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    },

    website: {
      type: String,
      required: true,
      trim: true,
    },

    certificates: {
      type: [String],
      required: true,
    },

    licenseNo: {
      type: String,
      required: true,
      trim: true,
    },

    languages: {
      type: [String],
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;