import { Router } from "express";

// import resendOtp from "../controllers/School/resendOtp.js";

// import {
//   getAllSchools,
//   getASingleSchool,
// } from "../controllers/School/getSchool.js";
// import { EditSchool } from "../controllers/School/editSchool.js";
// import { deleteSchool } from "../controllers/School/deleteSchool.js";
// import logoutSchool from "../controllers/School/logout.js";
// import resetPassword from "../controllers/School/resetPassword.js";
// import { createProfile } from "../controllers/School/SchoolProfile.js";
import { registerUser } from "../controllers/User/registerUser.js";
import { verifyOtp } from "../controllers/User/verifyUser.js";

const router = Router();

router.post("/register", registerUser);
// router.post("/login", loginSchool);
router.post("/verify/:id", verifyOtp);
// router.post("/resend-otp", resendOtp);
// router.post("/reset-password", resetPassword);
// router.get("/", getAllSchools);
// router.get("/:id", getASingleSchool);
// router.put("/:id", EditSchool);
// router.delete("/:id", deleteSchool);
// router.post("/logout", logoutSchool);
// router.put("/create-profile/:id", createProfile);

export default router;
