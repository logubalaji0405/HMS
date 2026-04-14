import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: String

   // ✅ ADD THESE
  specialization: String,
  availability: String
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);