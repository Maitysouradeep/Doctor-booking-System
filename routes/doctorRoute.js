const express=require('express');
const router=express.Router();
const Doctor = require("../models/doctorModel");
const authMiddlewares=require('../middlewares/authMiddlewares')
const Appointment=require('../models/appointmentModel')
const User=require("../models/usermodel")

router.post("/get-doctor-info-by-user-id",authMiddlewares,async(req,res)=>{
try{
    const doctor=await Doctor.findOne({userId:req.userId});
    res.status(200).send({
        success:true,
        message: "Doctor data fetched successfully",
        data:doctor,
    })
}
  catch(error){
    res
    .status(500)
    .send({message:"error getting doctor info",success:false,error});
  }
})

router.post("/get-doctor-info-by-id",authMiddlewares,async(req,res)=>{
try{
    const doctor=await Doctor.findOne({_id:req.body.doctorId});
    res.status(200).send({
        success:true,
        message: "Doctor data fetched successfully",
        data:doctor,
    })
}
  catch(error){
    res
    .status(500)
    .send({message:"error getting doctor info",success:false,error});
  }
})


router.post("/update-doctor-profile",authMiddlewares,async(req,res)=>{
try{
    const doctor=await Doctor.findOneAndUpdate({userId:req.userId},req.body);
    res.status(200).send({
        success:true,
        message: "Doctor profile updated successfully",
        data:doctor,
    })
}
  catch(error){
    res
    .status(500)
    .send({message:"error getting doctor info",success:false,error});
  }
})

router.get("/get-appointment-by-doctor-id", authMiddlewares, async (req, res) => {
  try {
    const doctor=await Doctor.findOne({userId:req.userId})
    const appointment = await Appointment.find({doctorId:doctor._id});
    res.status(200).send({
      message: "Appointment are fetched successfully",
      success: true,
      data:appointment,
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

router.post("/change-appointment-status", authMiddlewares, async (req, res) => {
  try {
    const { appointmentId, status} = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });
    const user = await User.findOne({_id:appointment.userId});

    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      type: "Appointment-status-changed",
      message: `Your appointment status has been ${status}`,
      onClickPath: "/appointment",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
      data:appointment,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({
      message: "Error changing appointment status",
      success: false,
      error,
    });
  }
});

module.exports=router;