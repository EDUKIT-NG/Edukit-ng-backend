import mongoose from "mongoose";

const { Schema } = mongoose;

const sponsorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    moneySend: { type: Number, default: 0 },
    password: { type: String, required: true, min: 8, max: 12 },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      default: "student",
      enum: ["student", "donor", "sponsor", "school", "admin", "volunteer"],
    },
  },
  { timestamps: true }
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
export default Sponsor;
