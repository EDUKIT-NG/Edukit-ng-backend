import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";

dotenv.config();

const users = {
  user: User,
  default: User,
};

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Kindly login first" });
    }

    // extracts the token from request header
    const bearerToken = authHeader.split(" ");

    const token = bearerToken[1];

    // verify token
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decode.id);
    if (!user) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(`Error verifying token: ${error.message}`);

    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token, please login again." });
    } else {
      return res.status(500).json({ message: error });
    }
  }
};
