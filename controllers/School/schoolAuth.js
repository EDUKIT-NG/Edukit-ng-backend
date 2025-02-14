import School from "../../models/School.js";
import schoolSchema from "../../Validation/schoolAuth.js";
import bcrypt from "bcrypt";
import { generateOtp } from "../../utils/GenerateOtp.js";
import Otp from "../../models/Otp.js";
import { sendMail } from "../../utils/Email.js";
import { sanitizeUser } from "../../utils/SanitizeUser.js";
import { generateToken } from "../../utils/GenerateToken.js";

export const registerSchool = async (req, res) => {
  try {
    const school = await schoolSchema.validateAsync(req.body);
    const { email, password, name } = school;

    const existingUser = await School.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "School already exists,Kindly login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSchool = new School({
      email,
      name,
      password: hashedPassword,
    });
    const savedSchool = await newSchool.save();
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const newOtp = new Otp({
      user: { id: savedSchool._id, userType: "School" },
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newOtp.save();

    // send otp to email
    await sendMail(
      email,
      "OTP Verification Code",
      `Your OTP is: <b>${otp}</b>`
    );
    const secureInfo = sanitizeUser(savedSchool);
    const token = generateToken(secureInfo);
    const cookieExpirationDays = parseInt(process.env.COOKIE_EXPIRATION_DAYS);
    if (isNaN(cookieExpirationDays)) {
      throw new Error("COOKIE_EXPIRATION_DAYS must be a valid number.");
    }
    // sends JWT token in the response cookies
    res.cookie("token", token, {
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      maxAge: cookieExpirationDays * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      school: sanitizeUser(savedSchool),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
