import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.model.js";
import studentProfileSchema from "../../Validation/User/studentProfile.js";
import { sanitizeUser } from "../../utils/SanitizeUser.js";

const createStudentProfile = expressAsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const result = await studentProfileSchema.validateAsync(req.body);
    const student = await User.findById(id);
    if (!student) {
      await session.abortTransaction();
      return res.status(404).json("Student not found");
    }
    const StudentData = await User.findByIdAndUpdate(
      id,
      {
        $set: result,
      },
      { new: true }
    );
    await session.commitTransaction();
    return res.status(200).json({ student: sanitizeUser(StudentData) });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export default createStudentProfile;
