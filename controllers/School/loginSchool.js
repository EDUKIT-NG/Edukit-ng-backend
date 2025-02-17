import School from "../../models/School.js";
import { generateToken } from "../../utils/GenerateToken.js";
import { sanitizeUser } from "../../utils/SanitizeUser.js";
import logInSchema from "../../Validation/school/loginSchool.js";
import bcrypt from "bcrypt";

const loginSchool = async (req, res) => {
  try {
    const result = await logInSchema.validateAsync(req.body);
    const { email, password } = result;
    const existingSchool = await School.findOne({ email });
    if (!existingSchool) {
      return res.status(404).json({
        message: `School with email ${email} not found! Would you like to register?`,
      });
    }
    console.log(existingSchool);

    const hashedPassword = existingSchool.password;
    if (!hashedPassword) {
      res.status(404).json({ message: "Password not found for this school." });
      return;
    }
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password. Please try again. " });
    }
    const secureInfo = sanitizeUser(existingSchool);
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
    res.status(200).json({
      message: "Login successful. ",
      school: sanitizeUser(existingSchool),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export default loginSchool;
