import express from "express";
import {
  getAllStudents,
  deleteStudent,
  login,
  register,
  getSingleStudent,
  updateStudent,
} from "../controllers/Student.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.delete("/delete/:id", deleteStudent);
router.get("/", getAllStudents);
router.get("/:id", getSingleStudent);
router.put("/update/:id", updateStudent);

export default router;
