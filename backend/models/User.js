import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: {
    type: String,
    enum: ["Patient", "Doctor", "Admin"],
    default: "Patient"
  }
});

module.exports = mongoose.model("User", UserSchema);