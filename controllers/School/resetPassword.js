import School from "../../models/School.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/GenerateToken.js";

const resetPassword = async (req, res) => {
  try {
    const { password, schoolId } = req.body;

    const school = await School.findById(schoolId);
    if (!school) {
      res.status(404).json({ message: "school not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSchoolPassword = await School.findByIdAndUpdate(schoolId, {
      password: hashedPassword,
    });
    const secureInfo = { id: school._id, userType: "School" };

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
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default resetPassword;
