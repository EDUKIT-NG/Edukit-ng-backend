import Sponsor from "../models/Sponsor.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../utils/SanitizeUser.js";
import { generateToken } from "../utils/GenerateToken.js";
import Otp from "../models/Otp.js";
import { generateOtp } from "../utils/GenerateOtp.js";
import PasswordResetToken from "../models/PasswordResetToken.js";
import { sendMail } from "../utils/Email.js";
import Logger from "../utils/Logger.js";
import { trackFailedLogin, resetFailedLogin } from "../utils/LoginLimiter.js";

const logger = Logger('SponsorController');

export const registerSponsor = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } =
      req.body;

    // check if sponsor email exist or not
    const existingSponsor = await Sponsor.findOne({ email });
    if (existingSponsor) {
      return res.status(409).json({
        message: "User already exists, please login instead.",
      });
    }

    // checks if password and confirmPassword are same
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // checks if password matches the regex pattern
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.",
      });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating new sponsor
    const createSponsor = new Sponsor({
      name,
      email,
      password: hashedPassword,
    });
    logger.info(`Sponsor created: ${createSponsor}`);
    await createSponsor.save();

    // generates Otp
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const newOtp = new Otp({
      user: { id: createSponsor._id, userType: "Sponsor" },
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
    logger.info(`Otp: ${otp}`);
    logger.info(`Sending Otp to ${email}`);

    // gets secure sponsor info
    const secureInfo = sanitizeUser(createSponsor);

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
  } catch (error) {
    logger.error(`Error while creating sponsor: ${error}`);
    res.status(500).json({
      "Error ": error,
      message: "Error occurred during account creation, please try again.",
    });
  }
};

export const loginSponsor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checks if sponsor exits
    const existingSponsor = await Sponsor.findOne({ email });

    // if the sponsor exists and password matched the hash password
    if (
      existingSponsor &&
      (await bcrypt.compare(password, existingSponsor.password))
    ) {
      if (!existingSponsor.isVerified) {
        return res.status(403).json({
          message:
            "Email not verified, Please verify your email using the OTP sent to your email.",
        });
      }

      // If user is soft deleted
      if (existingSponsor && existingSponsor.isDeleted) {
        return res.status(404).json({ message: "User account not found." });
      }

      // get secure user info
      const secureInfo = sanitizeUser(existingSponsor);

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

      // Reset failed login attempts on success
      resetFailedLogin(email);

      return res.status(200).json({
        message: "Login successful!",
        student: secureInfo,
      });
    }

    // Check if account is locked
    const { locked, remainingTime } = trackFailedLogin(email);
    if (locked) {
      logger.warn(`Account locked due to too many failed attempts: ${email}`);
      return res.status(403).json({
        message: `Too many failed attempts. Try again in ${Math.ceil(remainingTime)} seconds.`,
      });
    }

    return res.status(401).json({ message: "Invalid login credentials." });
  } catch (error) {
    logger.error('Error while logging in.', error);
    res
      .status(500)
      .json({ message: "Error occurred while logging in, please try again." });
  }
};

export const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;


    const updatedSponsor = await Sponsor.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedSponsor) {
      return res.status(404).json({ message: "Sponsor profile not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      sponsor: sanitizeUser(updatedSponsor),
    });
  } catch (error) {
    logger.error('Error while updating sponsor profile.', error);
    res.status(500).json({ message: "Error updating your profile" });
  }
};

export const getSingleSponsor = async (req, res) => {
  try {
    const userId = req.params.id;

    const sponsor = await Sponsor.findById(userId);

    if (!sponsor) {
      logger.warn(`Sponsor profile not found with id: ${userId}`);
      return res.status(404).json({ message: "Sponsor not found." });
    }

    res.status(200).json(sanitizeUser(sponsor));
  } catch (error) {
    logger.error(`Error while retrieving sponsor profile: ${error}`);
    res.status(500).json({ message: "Error retrieving the sponsor profile." });
  }
};

export const getAllSponsors = async (req, res) => {
  try {
    let sponsors = await Sponsor.find();

    // Sanitize sponsors data before returning
    sponsors = sponsors.map((sponsor) => sanitizeUser(sponsor));

    res.status(200).json(sponsors);
  } catch (error) {
    logger.error(`Error while retrieving sponsor profiles: ${error}`);
    res.status(500).json({ message: "Error retrieving sponsor profiles." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const sponsorId = req.user._id;
    const otp = req.body.otp;

    // checks if sponsor id exist
    const sponsor = await Sponsor.findById(sponsorId);

    // returns a 404 response if the sponsor id does not exist
    if (!sponsor) {
      return res.status(404).json({
        message: "Sponsor not found, for which the OTP has been generated.",
      });
    }

    // checks if otp exists by the sponsor id
    const isOtpExisting = await Otp.findOne({
      user: { id: sponsorId, userType: "Sponsor" },
    });

    // returns 404 if otp does not exists
    if (!isOtpExisting) {
      return res.status(404).json({ message: "Otp not found." });
    }

    // checks if the otp is expired and then deletes the otp
    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "Otp has expired." });
    }

    // checks if otp is there and matches the hash value then updates the sponsor verified status to true and returns the updated user
    if (isOtpExisting && (await bcrypt.compare(otp, isOtpExisting.otp))) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      const verifiedSponsor = await Sponsor.findByIdAndUpdate(
        sponsorId,
        { isVerified: true },
        { new: true }
      );

      return res.status(200).json({
        message: "Email verified:",
        sponsor: sanitizeUser(verifiedSponsor),
      });
    }

    return res.status(400).json({ message: "Otp is invalid or expired." });
  } catch (error) {
    console.error("Error while verifying otp.\n", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const sponsorId = req.body.id;

    // checks if the sponsor exists by id
    const existingSponsor = await Sponsor.findById(sponsorId);

    if (!existingSponsor) {
      return res.status(404).json({ message: "User not found." });
    }

    await Otp.deleteMany({ user: { id: sponsorId, userType: "Sponsor" } });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    logger.info(`Otp: ${otp}`);

    const newOtp = new Otp({
      user: { id: id, userType: "Sponsor" },
      otp: hashedOtp,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });
    await newOtp.save();

    await sendMail(
      existingSponsor.email,
      "OTP Verification Code",
      `Your OTP is: <b>${otp}</b>`
    );

    res.status(200).json({ message: "OTP Sent" });
  } catch (error) {
    console.error("Error while resending otp.\n", error);
    res.status(500).json({
      error: error.message,
      message: "Error occurred while resending otp, please try again.",
    });
  }
};

export const forgotPassword = async (req, res) => {
  let newToken;

  try {
    const { email } = req.body;

    // checks if sponsor provided email exists
    const isExistingSponsor = await Sponsor.findOne({ email });

    // returns a 404 response if the email does not exist
    if (!isExistingSponsor) {
      return res
        .status(404)
        .json({ message: "Provided email does not exist." });
    }

    await PasswordResetToken.deleteMany({ user: { id: isExistingSponsor._id, userType: 'Sponsor' } });

    // generates a password reset token if user exists
    const passwordResetToken = generateToken(
      sanitizeUser(isExistingSponsor),
      true
    );

    // hashes the token
    const hashedToken = await bcrypt.hash(passwordResetToken, 10);

    // saves hashed token in passwordResetToken collection
    newToken = new PasswordResetToken({
      user: { id: isExistingSponsor._id, userType: "Sponsor" },
      token: hashedToken,
      expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
    });

    await newToken.save();

    // sends password reset link to the user's email
    await sendMail(
      isExistingSponsor.email,
      "Password reset link",
      `<p>Dear ${isExistingSponsor.email}, We received a request to reset your password for the account. Please use the following link to reset your password:</p>
      <p><a href=${process.env.ORIGIN}/reset-password/${isExistingSponsor._id}/${passwordResetToken} target='_blank'>Reset Password</a></p>
      <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your security is important to us.</p>
      
      <p>Thank you,</p>
      <p>EduKit Team</p>`
    );

    res.status(200).json({
      message: `Password reset link sent to ${isExistingSponsor.email}`,
    });
  } catch (error) {
    console.error("Error while sending password reset link.\n", error);
    res.status(500).json({
      error: error.message,
      message:
        "Error occurred while sending password reset link on your email.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const email = jwt.decode(token).email;

    // checks if user exists
    const isExistingSponsor = await Sponsor.findOne({ email });

    // returns a 404 response if a user does not exists
    if (!isExistingSponsor) {
      res.status(404).json({ message: "Sponsor profile does not exists." });
    }

    // fetches the resetPassword token by the SponsorId
    const isResetTokenExisting = await PasswordResetToken.findOne({
      user: { id: isExistingSponsor._id, userType: "Sponsor" },
    });

    // returns a 404 response if the token does not exists
    if (!isResetTokenExisting) {
      return res.status(404).json({ message: "Reset link is not valid" });
    }

    // deletes expired token
    if (isResetTokenExisting.expiresAt < new Date()) {
      await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
      return res.status(404).json({ message: "Reset link has expired" });
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
      await Sponsor.findByIdAndUpdate(isExistingSponsor._id, {
        password: await bcrypt.hash(password, 10),
      });

      return res
        .status(200)
        .json({ message: "Password updated successfully." });
    }

    return res.status(404).json({ message: "Reset link has expired." });
  } catch (error) {
    console.error("Error while resetting password.\n", error);
    res.status(500).json({
      message: "Error occurred while resetting the password, please try again.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
      httpOnly: true,
      secure: process.env.PRODUCTION === "true",
    });

    res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    console.error("Error while trying to logout.\n", error);
    res.status(500).json({
      message:
        "An error occurred while you are trying to logout, please try again.",
    });
  }
};

export const deleteSponsor = async (req, res) => {
  try {
    const sponsorId = req.params.id;

    const deletedSponsor = await Sponsor.findById(sponsorId);

    if (!deletedSponsor) {
      return res.status(404).json({ message: "User account not found" });
    }

    deletedSponsor.isDeleted = true;
    await deletedSponsor.save();
    logger.info(`Sponsor deleted: ${JSON.stringify(sanitizeUser(deletedSponsor), null, 2)}`);

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error while deleting the sponsor.\n", error);
    res.status(500).json({
      message: "Error occurred while deleting your account, Please try again.",
    });
  }
};
