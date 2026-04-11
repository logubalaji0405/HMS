import express from "express";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/availability", protect, authorize("doctor"), async (req, res) => {
  try {
    req.user.availabilitySlots = req.body.availabilitySlots || [];
    await req.user.save();
    res.json({ message: "Availability updated", availabilitySlots: req.user.availabilitySlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
