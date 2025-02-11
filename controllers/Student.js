import Student from "../models/Student.js";
import bcrypt from "bcrypt";

// creates a new account
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, grade } = req.body;

    // check if your exist or not
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
    const student = new Student({
      name,
      email,
      phone,
      password: hashedPassword,
      grade,
    });
    await student.save();

    res.status(201).json({
      message:
        "Thank you for registering with us. Your account has been successfully created.",
    });
  } catch (error) {
    res.status(500).json({ "Error ": error, message: "Internal server error" });
  }
};

// logs in to a created account
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingStudent = await Student.findOne({ email });

    // if the user exists and password matched the hash password
    if (
      existingStudent &&
      (await bcrypt.compare(password, existingStudent.password))
    ) {
      return res.status(200).json({ message: " Login Successful." });
    }

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
