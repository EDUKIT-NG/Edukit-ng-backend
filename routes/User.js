import { Router } from "express";

// import {
//   getAllSchools,
//   getASingleSchool,
// } from "../controllers/School/getSchool.js";
// import { EditSchool } from "../controllers/School/editSchool.js";
// import { deleteSchool } from "../controllers/School/deleteSchool.js";
// import logoutSchool from "../controllers/School/logout.js";

// import { createProfile } from "../controllers/School/SchoolProfile.js";
import { registerUser } from "../controllers/User/registerUser.js";
import { verifyOtp } from "../controllers/User/verifyUser.js";
import resendOtp from "../controllers/User/resendOtp.js";
import loginUser from "../controllers/User/loginUser.js";
import resetPassword from "../controllers/User/resetPassword.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify/:id", verifyOtp);
router.post("/resend-otp/:id", resendOtp);
router.post("/reset-password/:id", resetPassword);
// router.get("/", getAllSchools);
// router.get("/:id", getASingleSchool);
// router.put("/:id", EditSchool);
// router.delete("/:id", deleteSchool);
// router.post("/logout", logoutSchool);
// router.put("/create-profile/:id", createProfile);

export default router;
