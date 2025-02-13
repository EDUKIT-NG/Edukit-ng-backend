import express from "express";
import {
  getAllStudents,
  deleteStudent,
  login,
  register,
  getSingleStudent,
  updateStudent,
  logout,
  checkAuth,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
} from "../controllers/Student.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)
  .post("/verify-otp", verifyOtp)
  .post("/resend-otp", resendOtp)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", resetPassword)
  .get("/check-auth", verifyToken, checkAuth)
  .post("/logout", logout)
  .delete("/delete/:id", deleteStudent)
  .get("/", getAllStudents)
  .get("/:id", getSingleStudent)
  .put("/update/:id", updateStudent);

export default router;
