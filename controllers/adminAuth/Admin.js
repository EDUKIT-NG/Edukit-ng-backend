import Admin from "../../models/Admin.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { generateOtp } from "../../utils/GenerateOtp.js";
import Otp from "../../models/Otp.js";
import dotenv from "dotenv";
import { sanitizeUser } from "../../utils/SanitizeUser.js";
import { generateAccessToken } from "../../utils/GenerateToken.js";
import mongoose from "mongoose";
import { sendMail } from "../../utils/Email.js";
import PasswordResetToken from "../../models/PasswordResetToken.js";
dotenv.config();

export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // checks is there is an existing admin using email
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    throw new Error("Admin already exists, please login.");
  }

  // checks if the the password matches the confirmPassword
  if (password !== confirmPassword) {
    throw new Error("Password do not match!");
  }

  // checks if the password matches the password pattern
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordPattern.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."
    );
  }

  // hashes the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creates a new admin
  const createAdmin = new Admin({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  // saves the created admin to the database
  await createAdmin.save();

  // generates an OTP and hashes it the create a new one and saves it on the db
  const otp = generateOtp();
  const hashOtp = await bcrypt.hash(otp, 10);
  const newOtp = new Otp({
    user: { id: createAdmin._id, userType: "Admin" },
    otp: hashOtp,
    expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
  });
  await newOtp.save();

  // sends email to the user containing the OTP
  await sendMail(email, "OTP Verification Code", `Your OTP is: <b>${otp}</b>`);

  // generates user info that are not sensitive
  const secureInfo = sanitizeUser(createAdmin);

  // generates a token for the user
  const token = generateAccessToken(secureInfo);

  // checks is cookie expiration day is a number
  const cookieExpirationDays = parseInt(process.env.COOKIE_EXPIRATION_DAYS);
  if (isNaN(cookieExpirationDays)) {
    throw new Error("COOKIE_EXPIRATION_DAYS must be a valid number.");
  }

  // sends JWT token in the response cookie
  res.cookie("token", token, {
    sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
    maxAge: cookieExpirationDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
  });

  res.status(201).json({
    message:
      "Registration successful. OTP sent to your email. Please enter the OTP to verify your email.",
    admin: secureInfo,
  });
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingAdmin = await Admin.findOne({ email });

  if (
    existingAdmin &&
    (await bcrypt.compare(password, existingAdmin.password))
  ) {
    if (!existingAdmin.isVerified) {
      throw new Error(
        "Email not verified, please verify your email using the OTP sent to your email."
      );
    }

    const secureInfo = sanitizeUser(existingAdmin);

    const token = generateToken(secureInfo);

    const cookieExpirationDays = parseInt(process.env.COOKIE_EXPIRATION_DAYS);
    if (isNaN(cookieExpirationDays)) {
      throw new Error("COOKIE_EXPIRATION_DAYS must be a valid number.");
    }

    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge: cookieExpirationDays * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    return res.status(200).json({
      message: "Login Successful!",
      admin: secureInfo,
    });
  }
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { id, otp } = req.body;

  const adminId = new mongoose.Types.ObjectId(id);

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new Error("Admin not found, for which the OTP has been generated.");
  }

  const isOtpExisting = await Otp.findOne({
    user: { id: admin._id, userType: "Admin" },
  });
  if (!isOtpExisting) {
    throw new Error("OTP not found.");
  }

  if (isOtpExisting.expiresAt < new Date()) {
    await Otp.findByIdAndDelete(isOtpExisting._id);
    throw new Error("OTP has expired.");
  }

  if (isOtpExisting && (await bcrypt.compare(otp, isOtpExisting.otp))) {
    await Otp.findByIdAndDelete(isOtpExisting._id);
    const verifiedAdmin = await Admin.findByIdAndUpdate(
      admin._id,
      {
        isVerified: true,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Email verified, You can now login.",
      admin: sanitizeUser(verifiedAdmin),
    });
  }

  throw new Error("Otp is invalid or has expired.");
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { admin } = req.body;

  const existingAdmin = await Admin.findById(admin);
  if (!existingAdmin) {
    throw new Error("Admin not found.");
  }

  await Otp.deleteMany({ admin: existingAdmin._id });

  const otp = generateOtp();
  const hashOtp = await bcrypt.hash(otp, 10);

  const newOtp = new Otp({
    user: { id: admin, userType: "Admin" },
    otp: hashOtp,
    expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
  });

  // saves the new OTP to the database
  await newOtp.save();

  await sendMail(
    existingAdmin.email,
    "OTP Verification Code",
    `Your OTP is: <b>${otp}</b>`
  );

  res.status(200).json({ message: "OTP Sent." });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  let newToken;

  const { email } = req.body;

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    throw new Error("Provided email does not exists.");
  }

  await PasswordResetToken.deleteMany({ admin: existingAdmin._id });

  const passwordResetToken = generateToken(sanitizeUser(existingAdmin), true);

  const hashToken = await bcrypt.hash(passwordResetToken, 10);

  newToken = new PasswordResetToken({
    user: { id: existingAdmin._id, userType: "Admin" },
    token: hashToken,
    expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
  });

  await newToken.save();

  await sendMail(
    existingAdmin.email,
    "Password reset link",
    `<p>Dear ${existingAdmin.email}, We received a request to reset your password for the account. Please use the following link to reset your password:</p>
      <p><a href=${process.env.ORIGIN}/reset-password/${existingAdmin._id}/${passwordResetToken} target='_blank'>Reset Password</a></p>
      <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your security is important to us.</p>
      
      <p>Thank you,</p>
      <p>EduKit Team</p>`
  );

  res
    .status(200)
    .json({ message: `Password reset link sent to ${existingAdmin.email}` });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { id, token, password } = req.body;

  const existingAdmin = await Admin.findById(id);
  if (!existingAdmin) {
    throw new Error("Admin does not exists.");
  }

  const isResetTokenExisting = await PasswordResetToken.findOne({
    user: { id: existingAdmin._id, userType: "Admin" },
  });
  if (!isResetTokenExisting) {
    throw new Error("Reset link is not valid.");
  }

  if (isResetTokenExisting.expiresAt < new Date()) {
    await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
    throw new Error("Reset link has been expired.");
  }

  if (
    isResetTokenExisting &&
    isResetTokenExisting.expiresAt > new Date() &&
    (await bcrypt.compare(token, isResetTokenExisting))
  ) {
    await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

    await Admin.findByIdAndUpdate(existingAdmin._id, {
      password: await bcrypt.hash(password, 10),
    });

    return res.status(200).json({ message: "Password updated successfully!" });
  }

  throw new Error("Reset link has expired.");
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    maxAge: 0,
    sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
  });

  res.status(200).json({ message: "Logout Successful!" });
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const adminId = req.params.id;

  const deletedAdmin = await Admin.findByIdAndDelete(adminId);

  if (!deletedAdmin) {
    throw new Error("Admin not found.");
  }

  res.status(200).json({ message: "Account deleted successfully." });
});
