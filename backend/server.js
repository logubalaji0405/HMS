import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Import routes (IMPORTANT .js)
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(express.json());

app.use(cors({
  origin: "https://hms-black-eta.vercel.app",
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// ✅ Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});