import { Router } from "express";
import { registerUser, verifyEmail } from "../controllers/User/registerUser.js";
import { verifyOtp } from "../controllers/User/verifyUser.js";
import resendOtp from "../controllers/User/resendOtp.js";
import passport from "passport";
import loginUser from "../controllers/User/loginUser.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/User/resetPassword.js";
import logout from "../controllers/User/logout.js";
import {
  getAllUsers,
  getASingleUser,
  getUserProfile,
} from "../controllers/User/getUser.js";
import { deleteUser } from "../controllers/User/deleteUser.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../utils/RefreshTokenHandler.js";
import { protect } from "../middleware/profileMiddleware.js";
// import { createProfileSchool } from "../controllers/User/SchoolProfile.js";
// import createStudentProfile from "../controllers/User/studentProfile.js";

const router = Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get("/profile", protect, getUserProfile)
  .post("/verify-otp", verifyToken, verifyOtp)
  .post("/resend-otp", verifyToken, resendOtp)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", verifyToken, resetPassword)
  .get("/verify-email/:id", verifyEmail)
  .get("/", getAllUsers)
  .post("/logout", logout)
  .get("/api/logout", (req, res) => {
    req.logout();
    res.send(req.user);
  })
  .get("/api/current_user", (req, res) => {
    res.send(req.user);
  })
  .post("/api/refresh_token", refreshToken)
  .get("/:id", getASingleUser)
  .delete("/:id", deleteUser);
// .put("/create-school-profile/:id", createProfileSchool)
// .put("/create-student-profile/:id", createStudentProfile);

export default router;
