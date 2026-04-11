import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import MedicalRecord from "../models/MedicalRecord.js";
import ChatMessage from "../models/Message.js";

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), async (req, res) => {
  try {
    const [patients, doctors, admins, appointments, records, messages] = await Promise.all([
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "admin" }),
      Appointment.countDocuments(),
      MedicalRecord.countDocuments(),
      ChatMessage.countDocuments()
    ]);

    res.json({ patients, doctors, admins, appointments, records, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
