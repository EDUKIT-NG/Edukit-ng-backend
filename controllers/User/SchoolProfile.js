import mongoose from "mongoose";
import User from "../../models/User.model.js";

import expressAsyncHandler from "express-async-handler";
import profileSchema from "../../Validation/User/schoolProfile.js";

export const createProfileSchool = expressAsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const result = await profileSchema.validateAsync(req.body);

    const school = await User.findById(id);
    if (!school) {
      await session.abortTransaction();
      return res.status(404).json({ message: "school not found" });
    }

    const schoolData = await User.findByIdAndUpdate(
      id,
      { $set: result },
      { new: true }
    );
    await session.commitTransaction();
    return res
      .status(201)
      .json({ message: "Profile created successfully", schoolData });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
