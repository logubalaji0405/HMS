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

// ✅ LOGIN API (optional)
router.post("/login", (req, res) => {
  res.json({ message: "Login working ✅" });
});

export default router;