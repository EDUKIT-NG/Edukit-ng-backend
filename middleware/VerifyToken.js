import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import { sanitizeUser } from "../utils/SanitizeUser.js";

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
    // const { token } = req.cookies;
    // console.log("token", token);

    // // return 401 if token is not there
    // if (!token) {
    //   return res
    //     .status(401)
    //     .json({ message: "Token missing, please login again." });
    // }

    // // verifies the token
    // const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);

    // // Fetch user details
    // const UserModel = users[decodedInfo.role];
    // const user = sanitizeUser(await User.findById(decodedInfo.id));
    // console.log(`User: ${JSON.stringify(user, null, 2)}`);

    // // If user does not exist or is soft deleted
    // if (!user || user.isDeleted) {
    //   console.log(`Invalid token used by ${req.ip}.\nToken: ${token}`);

    //   return res.status(401).json({ message: "Unauthorized: User not found" });
    // }

    // // Attach user details to request object
    // req.user = user;
    // console.log("end");

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
