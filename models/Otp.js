import mongoose from "mongoose";

const { Schema } = mongoose;

const otpSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);
// expires after 120sec
// generate otp after clicking submit button on sign up
// resend otp when the other one has expired
// notifications send to user emails within 5 sec
// generate random otp numbers  4 in number

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
