import Student from "../models/Student.js";
import bcrypt from "bcrypt";

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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingStudent = await Student.findOne({ email });

    // if the user exists and password matched the hash password
    if (
      existingStudent &&
      (await bcrypt.compare(password, existingStudent.password))
    ) {
      return res.status(200).json({message: " Login Successful."});
    }

    return res.status(404).json({ message: "Invalid Credentials." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error occurred while logging in, please try again." });
  }
};
