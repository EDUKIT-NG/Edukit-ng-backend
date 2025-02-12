import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import { sanitizeUser } from "../utils/SanitizeUser.js";
import { generateToken } from "../utils/GenerateToken.js";

// creates a new account
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, grade } = req.body;

    // check if student exist or not
    const existingStudent = await Student.findOne({ email });

    // if student already exists
    if (existingStudent) {
      return res.status(400).json({
        message: "User already exists, please login instead.",
      });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    // creating new student
    const createdStudent = new Student({
      name,
      email,
      phone,
      password: hashedPassword,
      grade,
    });
    await createdStudent.save();

    // gets secure student additionalInfo
    const secureInfo = sanitizeUser(createdStudent);

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

    res.status(201).json(sanitizeUser(createdStudent));
  } catch (error) {
    res.status(500).json({
      "Error ": error,
      message: "Error occurred during account creation, please try again.",
    });
  }
};

// logs in to a created account
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checks if student exits
    const existingStudent = await Student.findOne({ email });

    // if the student exists and password matched the hash password
    if (
      existingStudent &&
      (await bcrypt.compare(password, existingStudent.password))
    ) {
      // get secure user info
      const secureInfo = sanitizeUser(existingStudent);

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

      return res.status(200).json(sanitizeUser);
    }

    res.clearCookie("token");
    return res.status(404).json({ message: "Invalid Credentials." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while logging in, please try again." });
  }
};

// updates the student profile
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { name, email, phone, grade, additionalInfo } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        name,
        email,
        phone,
        grade,
        additionalInfo,
      },
      { new: true, runValidators: true }
    );
    await updatedStudent.save();

    if (!updatedStudent) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating your profile" });
  }
};

// get a specific student
export const getSingleStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the student." });
  }
};

// gets all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving students." });
  }
};

// deletes and existing account of a specific user
export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while deleting your account, Please try again.",
    });
  }
};
