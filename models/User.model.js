import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "school", "volunteer", "admin", "partner"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    PhoneNumber: {
      type: String,
    },
    Grade: {
      type: String,
    },
    StudentSchool: {
      type: String,
    },
    Address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
