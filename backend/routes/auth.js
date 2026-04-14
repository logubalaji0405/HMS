import express from "express";

const router = express.Router();

// ✅ REGISTER API
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  console.log("User Data:", req.body);

  res.status(200).json({
    success: true,
    message: "User registered successfully ✅",
    user: { name, email }
  });
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    res.json({
      message: "Login successful ✅",
      user
    });

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});

export default router;