import expressAsyncHandler from "express-async-handler";
import User from "../../models/User.model.js";

export const getAllUsers = expressAsyncHandler(async (req, res) => {
  let users = await User.find({});
  res.status(200).json(users);
});

export const getASingleUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "school not found" });
  }
  res.status(200).json({ user });
});
