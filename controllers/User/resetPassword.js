import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/GenerateToken.js";
import User from "../../models/User.model.js";
import PasswordResetToken from "../../models/PasswordResetToken.js";
import { sanitizeUser } from "../../utils/SanitizeUser.js";
import { sendMail } from "../../utils/Email.js";

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
        .json({ message: "Provided email does not exists" });
    }

    await PasswordResetToken.deleteMany({ user: isExistingUser._id });

    // if user exists, generate a password reset token
    const passwordResetToken = generateToken(
      sanitizeUser(isExistingUser),
      true
    );

    // hashes the token
    const hashedToken = await bcrypt.hash(passwordResetToken, 10);

    // saves hashed token in passwordResetToken collection
    newToken = new PasswordResetToken({
      user: {
        id: isExistingUser._id,
        userType: isExistingUser.role,
      },
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });

    await newToken.save();

    // sends the password reset link to the user's email
    await sendMail(
      isExistingUser.email,
      "Password reset link",
      `<p>Dear ${isExistingUser.email},
                We received a request to reset the password for your account. please use the following link to reset your password:</p>
                <p><a href=${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken} target='_blank'>Reset Password</a></p>
                <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your account security is important to us.

                Thank you,
                Edukit Team</p>`
    );

    res
      .status(200)
      .json({ message: `Password reset link sent to ${isExistingUser.email}` });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while sending password reset email.",
      error,
    });
  }
});

export const resetPassword = expressAsyncHandler(async (req, res) => {
  const { id, token, password } = req.body;

  try {
    // checks if user exists or not
    const isExistingUser = await User.findById(id);

    // if user does not exists then returns a 404 response
    if (!isExistingUser) {
      return res.status(404).json({ message: "User does not exists" });
    }

    // fetches the resetPassword token by the userId
    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: isExistingUser._id,
    });

    // if token does not exists for that userId then returns a 404 response
    if (!isResetTokenExisting) {
      return res.status(404).json({ message: "Reset link in not valid" });
    }

    // if the token has expired then deletes the token and send response accordingly
    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({ message: "Reset link has been expired." });
    }

    // if token exists and if not expired and token matches the hash, then reset the user password and deletes the token
    if (
      isResetTokenExisting &&
      isResetTokenExisting.expiresAt > new Date() &&
      (await bcrypt.compare(token, isResetTokenExisting.token))
    ) {
      // deleting the password reset token
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

      // resets the password after hashing it
      await User.findByIdAndUpdate(isExistingUser._id, {
        password: await bcrypt.hash(password, 10),
      });
      return res.status(200).json({ message: "Password updated successfully" });
    }

    return res.status(404).json({ message: "Reset link has been expired" });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while resetting the password, please try again.",
    });
  }
});
