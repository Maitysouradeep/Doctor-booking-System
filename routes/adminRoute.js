const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");
const Doctor = require("../models/doctorModel");
const authMiddlewares = require("../middlewares/authMiddlewares");
router.get("/get-all-doctors", authMiddlewares, async (req, res) => {
  try {
    const doctor = await Doctor.find({});
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

router.get("/get-all-users", authMiddlewares, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).send({
      message: "Users are fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error applying user account",
      success: false,
      error,
    });
  }
});

router.post("/change-doctor-account-status", authMiddlewares, async (req, res) => {
  try {
    const { doctorId, status} = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status,
    });
    const user = await User.findOne({ _id: doctor.userId });

    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      type: "doctor-request-changed",
      message: `Your doctor account has been ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor=status==="Approved"?true:false;
    await user.save();
    res.status(200).send({
      success: true,
      message: "doctor data updated successfully",
      data:doctor,
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
module.exports = router;
