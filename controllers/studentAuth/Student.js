import Student from "../../models/Student.js";
import bcrypt from "bcrypt";
import { sanitizeUser } from "../../utils/SanitizeUser.js";
import { generateToken } from "../../utils/GenerateToken.js";
import Otp from "../../models/Otp.js";
import { generateOtp } from "../../utils/GenerateOtp.js";
import PasswordResetToken from "../../models/PasswordResetToken.js";
import { sendMail } from "../../utils/Email.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

export const registerStudent = asyncHandler(async (req, res) => {
  const { name, username, email, phone, password, grade, confirmPassword } =
    req.body;

  // check if student email exist or not
  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new Error("User already exists, please login.");
  }

  // checks if username already exists
  const existingUsername = await Student.findOne({ username });
  if (existingUsername) {
    throw new Error(
      "Username already exists, please choose a different username."
    );
  }

  // checks if password and confirmPassword are same
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  // checks if password matches the regex pattern
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."
    );
  }

  // hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // creating new student
  const createStudent = new Student({
    name,
    username,
    email,
    phone,
    grade,
    password: hashedPassword,
  });
  await createStudent.save();

  // generates Otp
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const newOtp = new Otp({
    user: { id: createStudent._id, userType: "Student" },
    otp: hashedOtp,
    expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
  });
  await newOtp.save();

  // send otp to email
  await sendMail(email, "OTP Verification Code", `Your OTP is: <b>${otp}</b>`);

  // gets secure student info
  const secureInfo = sanitizeUser(createStudent);

  // generates JWT token
  const token = generateToken(secureInfo);

  // checks if COOKIE_EXPIRATION_DAYS defined if is a Number
  const cookieExpirationDays = parseInt(process.env.COOKIE_EXPIRATION_DAYS);
  if (isNaN(cookieExpirationDays)) {
    throw new Error("COOKIE_EXPIRATiON_DAYS must be a valid number.");
  }

  // sends JWT token in the response cookies
  res.cookie("token", token, {
    sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
    maxAge: cookieExpirationDays * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
  });

  res.status(201).json({
    message:
      "Registration successful. OTP sent to your email. Please enter to verify your email.",
    student: secureInfo,
  });
});

export const loginStudent = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // checks if student exits
  const existingStudent = await Student.findOne({
    $or: [{ email }, { username }],
  });

  // if the student exists and password matched the hash password
  if (
    existingStudent &&
    (await bcrypt.compare(password, existingStudent.password))
  ) {
    if (!existingStudent.isVerified) {
      throw new Error(
        "Email not verified, Please verify your email using the OTP sent to your email."
      );
    }
    // get secure user info
    const secureInfo = sanitizeUser(existingStudent);

    // generates JWT token
    const token = generateToken(secureInfo);

    // checks is COOKIE_EXPIRATION_DAYS defined if is a Number
    const cookieExpirationDays = parseInt(process.env.COOKIE_EXPIRATION_DAYS);
    if (isNaN(cookieExpirationDays)) {
      throw new Error("COOKIE_EXPIRATiON_DAYS must be a valid number.");
    }

    // sends JWT token in the response cookies
    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge: cookieExpirationDays * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    return res.status(200).json({
      message: "Login successful!",
      student: secureInfo,
    });
  }

  return res.status(401).json({ message: "Invalid login credentials." });
});

export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const updatedStudent = await Student.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedStudent) {
    throw new Error("User not found.");
  }

  res.status(201).json({
    message: "Profile updated successfully.",
    student: updatedStudent,
  });
});

export const getSingleStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id);

  if (!student) {
    throw new Error("User not found.");
  }

  res.status(200).json(sanitizeUser(student));
});

export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();

  res.status(200).json(students);
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { id, otp } = req.body;

  const studentId = new mongoose.Types.ObjectId(id);

  // checks if student id exist
  const student = await Student.findById(studentId);

  // returns a 404 response if the student id does not exist
  if (!student) {
    throw new Error("Student not found, for which the OTP has been generated.");
  }

  // checks if otp exists by the student id
  const isOtpExisting = await Otp.findOne({
    user: { id: student._id, userType: "Student" },
  });

  // returns 404 if otp does not exists
  if (!isOtpExisting) {
    throw new Error("Otp not found.");
  }

  // checks if the otp is expired and then deletes the otp
  if (isOtpExisting.expiresAt < new Date()) {
    await Otp.findByIdAndDelete(isOtpExisting._id);
    throw new Error("Otp has expired.");
  }

  // checks if otp is there and matches the hash value then updates the student verified status to true and returns the updated user
  if (isOtpExisting && (await bcrypt.compare(otp, isOtpExisting.otp))) {
    await Otp.findByIdAndDelete(isOtpExisting._id);
    const verifiedStudent = await Student.findByIdAndUpdate(
      student._id,
      { isVerified: true },
      { new: true }
    );

    return res.status(200).json({
      message: "Email verified, You can now login.",
      student: sanitizeUser(verifiedStudent),
    });
  }

  throw new Error("Otp is invalid or has expired.");
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { student } = req.body;

  // checks if the student exists by id
  const existingStudent = await Student.findById(student);

  if (!existingStudent) {
    throw new Error("User not found.");
  }

  await Otp.deleteMany({ student: existingStudent._id });

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const newOtp = new Otp({
    user: { id: student, userType: "Student" },
    otp: hashedOtp,
    expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
  });
  await newOtp.save();

  await sendMail(
    existingStudent.email,
    "OTP Verification Code",
    `Your OTP is: <b>${otp}</b>`
  );

  res.status(200).json({ message: "OTP Sent" });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  let newToken;

  const { email } = req.body;

  // checks if student provided email exists
  const isExistingStudent = await Student.findOne({ email });

  // returns a 404 response if the email does not exist
  if (!isExistingStudent) {
    throw new Error("Provided email does not exists.");
  }

  await PasswordResetToken.deleteMany({ student: isExistingStudent._id });

  // generates a password reset token if user exists
  const passwordResetToken = generateToken(
    sanitizeUser(isExistingStudent),
    true
  );

  // hashes the token
  const hashedToken = await bcrypt.hash(passwordResetToken, 10);

  // saves hashed token in passwordResetToken collection
  newToken = new PasswordResetToken({
    user: { id: isExistingStudent._id, userType: "Student" },
    token: hashedToken,
    expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
  });

  await newToken.save();

  // sends password reset link to the user's email
  await sendMail(
    isExistingStudent.email,
    "Password reset link",
    `<p>Dear ${isExistingStudent.email}, We received a request to reset your password for the account. Please use the following link to reset your password:</p>
      <p><a href=${process.env.ORIGIN}/reset-password/${isExistingStudent._id}/${passwordResetToken} target='_blank'>Reset Password</a></p>
      <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your security is important to us.</p>
      
      <p>Thank you,</p>
      <p>EduKit Team</p>`
  );

  res.status(200).json({
    message: `Password reset link sent to ${isExistingStudent.email}`,
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { id, token, password } = req.body;

  // checks if user exists
  const isExistingStudent = await Student.findById(id);

  // returns a 404 response if a user does not exists
  if (!isExistingStudent) {
    throw new Error("Student does not exists.");
  }

  // fetches the resetPassword token by the studentId
  const isResetTokenExisting = await PasswordResetToken.findOne({
    user: { id: isExistingStudent._id, userType: "Student" },
  });

  // returns a 404 response if the token does not exists
  if (!isResetTokenExisting) {
    throw new Error("Reset link is not valid");
  }

  // deletes expired token
  if (isResetTokenExisting.expiresAt < new Date()) {
    await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
    throw new Error("Reset link has been expired");
  }

  // resets the user password and deletes the token if it has not expired and matches the hash
  if (
    isResetTokenExisting &&
    isResetTokenExisting.expiresAt > new Date() &&
    (await bcrypt.compare(token, isResetTokenExisting.token))
  ) {
    // deletes the password reset token
    await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

    // resets the password after hashing it
    await Student.findByIdAndUpdate(isExistingStudent._id, {
      password: await bcrypt.hash(password, 10),
    });

    return res.status(200).json({ message: "Password updated successfully." });
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

  res.status(200).json({ message: "Logout successful!" });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.id;

  const deletedStudent = await Student.findByIdAndDelete(studentId);

  if (!deletedStudent) {
    throw new Error("Student not found");
  }

  res.status(200).json({ message: "Account deleted successfully." });
});
