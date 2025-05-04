import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) {
    return res.status(401).json({ message: "Kindly login to access" });
  }
  try {
    const decode = jwt.verify(refresh, process.env.REFRESH_KEY);
    const user = await User.findById(decode.id);
    if (!user) {
      return res.status(403).json({ message: "Kindly login" });
    }
    const access_token = generateAccessToken(user._id);
    const new_refresh_token = generateRefreshToken(user._id);
    return res.status(200).json(access_token, new_refresh_token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired  token" });
  }
};
