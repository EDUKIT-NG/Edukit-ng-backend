import express from "express";
import {
  deleteAdmin,
  forgotPassword,
  loginAdmin,
  logout,
  registerAdmin,
  resendOtp,
  resetPassword,
  verifyOtp,
} from "../controllers/adminAuth/Admin.js";

const router = express.Router();

router
  .post("/register", registerAdmin)
  .post("/login", loginAdmin)
  .post("/verify-otp", verifyOtp)
  .post("/resend-otp", resendOtp)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", resetPassword)
  .post("/logout", logout)
  .delete("/delete/:id", deleteAdmin);

export default router;
