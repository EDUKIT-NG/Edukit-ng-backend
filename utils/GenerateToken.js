import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateToken = (payload, passwordReset = false) => {
  // checks if secret-key is defined
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in the environment variables.");
  }

  // determines expiration time based on the token type
  const expiration = passwordReset
    ? process.env.PASSWORD_RESET_TOKEN_EXPIRATION
    : process.env.LOGIN_TOKEN_EXPIRATION;

  // checks if expiration is defined
  if (!expiration) {
    throw new Error(
      "Token expiration time is not defined in the environment variables."
    );
  }

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: expiration,
  });
};
