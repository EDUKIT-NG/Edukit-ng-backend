import { Router } from "express";

import { registerUser } from "../controllers/User/registerUser.js";
import { verifyOtp } from "../controllers/User/verifyUser.js";
import resendOtp from "../controllers/User/resendOtp.js";
import loginUser from "../controllers/User/loginUser.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/User/resetPassword.js";
import logout from "../controllers/User/logout.js";
import { getAllUsers, getASingleUser } from "../controllers/User/getUser.js";
import { deleteUser } from "../controllers/User/deleteUser.js";
import { createProfileSchool } from "../controllers/User/SchoolProfile.js";
import createStudentProfile from "../controllers/User/studentProfile.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/verify",  verifyOtp)
  .post("/resend-otp", resendOtp)
  .post("/forgot-password", forgotPassword)
  .post("/reset-password", resetPassword)
  .get("/", getAllUsers)
  .get("/:id", getASingleUser)
  .delete("/:id", deleteUser)
  .post("/logout", logout)
  .put("/create-school-profile/:id", createProfileSchool)
  .put("/create-student-profile/:id", createStudentProfile);

export default router;
