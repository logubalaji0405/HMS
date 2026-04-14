import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ✅ ROUTES
import authRoutes from "./routes/auth.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import recordRoutes from "./routes/medicalRecordRoutes.js";  
import chatRoutes from "./routes/chatRoutes.js";     

dotenv.config();

const app = express(); // ✅ MUST COME FIRST

// ✅ CORS FIX (VERY IMPORTANT)
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://hms-black-eta.vercel.app"
    ],

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// ✅ MIDDLEWARE
app.use(express.json());

// ✅ ROUTES (AFTER MIDDLEWARE)
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", recordRoutes);
app.use("/api/chat", chatRoutes);

// ✅ TEST ROUTE
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