import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.model.js";
import { sanitizeUser } from "../../utils/SanitizeUser.js";

export const getUserProfile = expressAsyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found." });
  }

  const user = sanitizeUser(req.user);

  return res.status(200).json({ user });
});

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  let users = await User.find({});
  res.status(200).json(users);
});

export const getASingleUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
});
