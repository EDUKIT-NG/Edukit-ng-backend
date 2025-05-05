import User from "../../models/User.model.js";
import Otp from "../../models/Otp.js";
import bcrypt from "bcrypt";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { sendMail } from "../../utils/Email.js";

export const verifyOtp = expressAsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { otp } = req.body;

    const id = req.user?._id;

    const user = await User.findById(id);

    if (!user) {
      session.abortTransaction();
      return res.status(404).json({
        message: "User not found, for which the OTP has been generated.",
      });
    }

    const isOtpExisting = await Otp.findOne({ "user.id": id });
    console.log("isOtpExisting", isOtpExisting);

    if (!isOtpExisting) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Otp not found." });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      console.log("expires", isOtpExisting.expiresAt);
      console.log("date", new Date());

      await Otp.findByIdAndDelete(isOtpExisting._id);
      await session.abortTransaction();
      return res.status(400).json({ message: "Otp has expired." });
    }

    const isMatch = await bcrypt.compare(otp, isOtpExisting.otp);
    if (!isMatch) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    await Otp.findByIdAndDelete(isOtpExisting._id);
    await sendMail(
      user.email,
      "Password Reset OTP",
      `Your password has been changed successfully</b>`
    );
    await session.commitTransaction();
    return res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
