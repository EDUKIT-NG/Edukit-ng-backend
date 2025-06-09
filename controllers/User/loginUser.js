import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.model.js";
import bcrypt from "bcrypt";
import logInSchema from "../../Validation/User/loginValidation.js";
import mongoose from "mongoose";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/GenerateToken.js";

const loginUser = expressAsyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await logInSchema.validateAsync(req.body);
    const { email, password } = result;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      await session.abortTransaction();
      return res.status(404).json({
        message: `User with email ${email} not found! Would you like to register?`,
      });
    }

    const hashedPassword = existingUser.password;

    if (!hashedPassword) {
      await session.abortTransaction();
      res.status(404).json({ message: "User password not found " });
      return;
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Invalid email or password. Please try again. " });
    }

    const access_token = generateAccessToken(existingUser._id);
    const refresh_token = generateRefreshToken(existingUser._id);

    await session.commitTransaction();
    return res.status(200).json({
      message: "Login successful. ",
      access_token,
      refresh_token,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export default loginUser;
