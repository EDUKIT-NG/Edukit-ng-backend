import School from "../../models/School.js";
import Otp from "../../models/Otp.js";
import bcrypt from "bcrypt";

export const verifyOtp = async (req, res) => {
  try {
    const { id, otp } = req.body;

    // checks if school id exist
    const school = await School.findById(id);
    console.log(school);

    // returns a 404 response if the student id does not exist
    if (!school) {
      return res.status(404).json({
        message: "School not found, for which the OTP has been generated.",
      });
    }

    // checks if otp exists by the student id
    const isOtpExisting = await Otp.findOne({ "user.id": id });
    console.log("OTP", isOtpExisting);

    // returns 404 if otp does not exists
    if (!isOtpExisting) {
      return res.status(404).json({ message: "Otp not found." });
    }

    // checks if the otp is expired and then deletes the otp
    if (isOtpExisting.expiresAt < new Date()) {
      await Otp.findByIdAndDelete(isOtpExisting._id);
      return res.status(400).json({ message: "Otp has expired." });
    }

    const isMatch = await bcrypt.compare(otp, isOtpExisting.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // checks if otp is there and matches the hash value then updates the student verified status to true and returns the updated user
    const verifiedSchool = await School.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    await Otp.findByIdAndDelete(isOtpExisting._id);

    return res.status(200).json({
      message: "Email verified:",
      //   student: sanitizeUser(verifiedSchool),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
