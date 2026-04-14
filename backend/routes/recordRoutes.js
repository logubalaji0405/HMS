import express from "express";
import MedicalRecord from "../models/MedicalRecord.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient sees own records, doctor/admin can also access their side
router.get("/mine", protect, async (req, res) => {
  try {
    let records = [];

    if (req.user.role === "patient") {
      records = await MedicalRecord.find({ patient: req.user._id })
        .populate("doctor", "name specialization email")
        .populate("patient", "name email");
    } else if (req.user.role === "doctor") {
      records = await MedicalRecord.find({ doctor: req.user._id })
        .populate("doctor", "name specialization email")
        .populate("patient", "name email phone");
    } else {
      records = await MedicalRecord.find()
        .populate("doctor", "name specialization email")
        .populate("patient", "name email");
    }

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor/admin create record
router.post("/", protect, authorize("doctor", "admin"), async (req, res) => {
  try {
    const { patient, diagnosis, prescription, notes, visitDate } = req.body;

    const record = await MedicalRecord.create({
      patient,
      doctor: req.user._id,
      diagnosis,
      prescription,
      notes,
      visitDate
    });

    const populated = await MedicalRecord.findById(record._id)
      .populate("doctor", "name specialization email")
      .populate("patient", "name email phone");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;