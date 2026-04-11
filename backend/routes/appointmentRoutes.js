import express from "express";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient books appointment
router.post("/", protect, authorize("patient"), async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      paymentReference
    } = req.body;

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      paymentReference: paymentReference || ""
    });

    const populated = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialization email")
      .populate("patient", "name email phone");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Patient/doctor/admin own appointments
router.get("/mine", protect, async (req, res) => {
  try {
    let appointments = [];

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate("doctor", "name specialization email");
    } else if (req.user.role === "doctor") {
      appointments = await Appointment.find({ doctor: req.user._id })
        .populate("patient", "name email phone");
    } else {
      appointments = await Appointment.find()
        .populate("patient", "name email")
        .populate("doctor", "name specialization");
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor/admin update status
router.put("/:id/status", protect, authorize("doctor", "admin"), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (
      req.user.role === "doctor" &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not your appointment" });
    }

    appointment.status = req.body.status || appointment.status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;