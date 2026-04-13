import express from "express";
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;