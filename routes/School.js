import { Router } from "express";
import { registerSchool } from "../controllers/School/registerSchool.js";
import loginSchool from "../controllers/School/loginSchool.js";

const router = Router();

router.post("/register", registerSchool);
router.post("/login", loginSchool);

export default router;
