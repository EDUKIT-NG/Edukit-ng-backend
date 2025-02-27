import User from "../../models/User.model.js";
import Otp from "../../models/Otp.js";
import bcrypt from "bcrypt";

export const verifyOtp = async (req, res) => {
  try {
    const { id, otp } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found, for which the OTP has been generated.",
      });
    }

    const isOtpExisting = await Otp.findOne({ "user.id": id });
    console.log("OTP", isOtpExisting);

    if (!isOtpExisting) {
      return res.status(404).json({ message: "Otp not found." });
    }

    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "Otp has expired." });
    }

    const isMatch = await bcrypt.compare(otp, isOtpExisting.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    const verifiedUser = await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    await Otp.findByIdAndDelete(isOtpExisting._id);

    return res.status(200).json({
      message: "Email verified:",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
