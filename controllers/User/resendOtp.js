import Otp from "../../models/Otp.js";
import { generateOtp } from "../../utils/GenerateOtp.js";
import bcrypt from "bcrypt";
import { sendMail } from "../../utils/Email.js";
import mongoose from "mongoose";
import User from "../../models/User.model.js";
import expressAsyncHandler from "express-async-handler";

const resendOtp = expressAsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    const otp = await Otp.findOne({ "user.id": id });
    if (otp) {
      await Otp.findByIdAndDelete(otp.id);
    }

    let new_otp = generateOtp();
    let hashedOtp = await bcrypt.hash(new_otp, 10);
    const newOtp = new Otp({
      user: { id: id, userType: user.role },
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });

    await newOtp.save();

    await sendMail(
      user.email,
      "OTP Verification Code",
      `Your OTP is: <b>${new_otp}</b>`
    );

    await session.commitTransaction();
    return res.status(200).json("OTP sent successfully");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export default resendOtp;
