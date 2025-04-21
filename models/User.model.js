import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    ContactPerson: {
      type: String,
      unique: true,
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
      enum: ["student", "volunteer", "donor", "school", "admin", "sponsor"],
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    grade: {
      type: String,
    },

    studentSchool: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    noOfStudents: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
