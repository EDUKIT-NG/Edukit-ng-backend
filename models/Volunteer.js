import mongoose from "mongoose";

const { Schema } = mongoose;

const volunteerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 12 },
    address: { type: String, required: true },
    skills: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["collection", "sorting", "distribution"],
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      default: "Student",
      enum: ["student", "volunteer", "sponsor", "school", "admin", "donor"],
    },
  },
  { timestamps: true }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;

// access the dashboard
