import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    password: { type: String, required: true },
    additionalInfo: { type: Object, default: {} },
    role: {
      type: String,
      default: "student",
      enum: ["student", "volunteer", "donor", "school", "admin", "sponsor"],
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
