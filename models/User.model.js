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
      required: function () {
        return !this.googleId; // Requires password for non-Google users
      },
    },
    googleId: { type: String, unique: true, sparse: true },

    role: {
      type: String,
      enum: ["student", "volunteer", "donor", "school", "admin", "sponsor"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    phoneNumber: {
      type: String,
    },

    contactPerson: {type: String,},

    grade: {
      type: String,
    },

    studentSchool: {
      type: String,
    },

    address: {
      type: String,
    },

    noOfStudents: {
      type: Number,
    },

    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
