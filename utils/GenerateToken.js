import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.SECRET_KEY, {
    expiresIn: process.env.LOGIN_TOKEN_EXPIRATION,
  });
};

export const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.REFRESH_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
};
