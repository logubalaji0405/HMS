import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ CORS FIX
app.use(cors({
  origin: ["http://localhost:5173", "https://hms-black-eta.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);

// ✅ TEST
app.get("/", (req, res) => {
  res.send("API Running ✅");
});

// ✅ DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// ✅ SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});