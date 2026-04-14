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

// ✅ LOGIN API
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "test@gmail.com" && password === "123456") {
    return res.json({
      success: true,
      message: "Login successful ✅",
      token: "dummy-token-123"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid email or password ❌"
  });
});


export default router;