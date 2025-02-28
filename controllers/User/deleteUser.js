import User from "../../models/User.model.js";
import expressAsyncHandler from "express-async-handler";
export const deleteUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  await User.findOneAndDelete(id);

  res.status(200).json({ message: "User deleted successfully" });
});
