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
    const { id } = req.params;
    const { otp } = req.body;

    const user = await User.findById(id);
    console.log(user);

    if (!user) {
      session.abortTransaction();
      return res.status(404).json({
        message: "User not found, for which the OTP has been generated.",
      });
    }
    if (user.isVerified) {
      await session.commitTransaction();
      return res.status(200).json({
        message: "User is already verified.",
      });
    }

    const isOtpExisting = await Otp.findOne({ "user.id": id });
    console.log("OTP", isOtpExisting);

    if (!isOtpExisting) {
      session.abortTransaction();
      return res.status(404).json({ message: "Otp not found." });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      session.abortTransaction();
      return res.status(400).json({ message: "Otp has expired." });
    }

    const isMatch = await bcrypt.compare(otp, isOtpExisting.otp);
    if (!isMatch) {
      session.abortTransaction();
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const verifiedUser = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    await Otp.findByIdAndDelete(isOtpExisting._id);
    await sendMail(
      user.email,
      "Account Creation",
      `Your account has been created successfully</b>`
    );
    session.commitTransaction();

    return res.status(200).json({
      message: "Email verified:",
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
