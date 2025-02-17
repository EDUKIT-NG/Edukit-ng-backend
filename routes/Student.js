import express from "express";
import {
  getAllStudents,
  deleteStudent,
  getSingleStudent,
  updateStudent,
  logout,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  loginStudent,
  registerStudent,
} from "../controllers/studentAuth/Student.js";

const router = express.Router();

router
  .post("/register", registerStudent)
  .post("/login", loginStudent)
  .post("/verify-otp", verifyOtp)
  .post("/resend-otp", resendOtp)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", resetPassword)
  .post("/logout", logout)
  .delete("/delete/:id", deleteStudent)
  .get("/", getAllStudents)
  .get("/:id", getSingleStudent)
  .put("/update/:id", updateStudent);

export default router;
