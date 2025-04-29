import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../../models/User.model.js";
import Otp from "../../models/Otp.js";
import { sendMail } from "../../utils/Email.js";
import { generateOtp } from "../../utils/GenerateOtp.js";

export const forgotPassword = expressAsyncHandler(async (req, res) => {
  let newToken;
  const { email } = req.body;

  try {
    // checks if user provided email exists or not
    const isExistingUser = await User.findOne({ email });

    // if email does not exists return a 404 response
    if (!isExistingUser) {
      return res
        .status(404)
        .json({ message: "Provided email does not exists." });
    }

    await Otp.deleteMany({ user: isExistingUser._id });

    // generate a random OTP
    const otp = generateOtp();

    // hashes the OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // saves hashed otp in passwordResetToken collection
    newToken = new Otp({
      user: {
        id: isExistingUser._id,
        userType: isExistingUser.role,
      },
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });

    await newToken.save();

    // sends the password reset link to the user's email
    await sendMail(
      isExistingUser.email,
      "Password reset OTP",
      `Your OTP is: <b>${otp}</b>`
    );

    res
      .status(200)
      .json({ message: `Password reset OTP sent to ${isExistingUser.email}` });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while sending password reset email.",
      error,
    });
  }
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  try {
    // checks if user exists or not
    const isExistingUser = await User.findById(id);

    // if user does not exists then returns a 404 response
    if (!isExistingUser) {
      return res.status(404).json({ message: "User does not exists" });
    }

    // resets the password after hashing it
    await User.findByIdAndUpdate(isExistingUser._id, {
      password: await bcrypt.hash(password, 10),
    });
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while resetting the password, please try again.",
    });
  }
});
