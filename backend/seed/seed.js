import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany({ email: { $in: ["admin@healix.com", "doctor@healix.com", "patient@healix.com"] } });

  const hash = await bcrypt.hash("123456", 10);

  await User.create([
    {
      name: "Admin User",
      email: "admin@healix.com",
      password: hash,
      role: "admin"
    },
    {
      name: "Dr. Meena",
      email: "doctor@healix.com",
      password: hash,
      role: "doctor",
      specialization: "Cardiologist",
      availabilitySlots: ["Mon 10:00 AM", "Tue 02:00 PM", "Fri 11:30 AM"]
    },
    {
      name: "Patient Demo",
      email: "patient@healix.com",
      password: hash,
      role: "patient",
      phone: "9876543210"
    }
  ]);

  console.log("Seed data inserted");
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
