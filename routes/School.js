import { Router } from "express";
import { registerSchool } from "../controllers/School/schoolAuth.js";

const router = Router();

router.post("/register", registerSchool);

export default router;
