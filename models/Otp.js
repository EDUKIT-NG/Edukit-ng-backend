import mongoose from "mongoose";

const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    user: {
      id: { type: Schema.Types.ObjectId, required: true, refPath: "userType" },
      userType: {
        type: String,
        required: true,
        enum: ["Student", "Donor", "Volunteer", "School", "Sponsor"],
      },
    },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
