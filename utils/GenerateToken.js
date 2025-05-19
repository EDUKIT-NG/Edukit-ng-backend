import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.LOGIN_TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};
