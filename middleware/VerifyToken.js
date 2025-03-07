import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Logger from "../utils/Logger.js";
import Donor from "../models/Donor.js";
import { sanitizeUser } from "../utils/SanitizeUser.js";

dotenv.config();
const logger = Logger.getLogger("TokenMiddleware");

const users = {
  // student: Student,
  // sponsor: Sponsor,
  donor: Donor,
  // school: School,
}

export const verifyToken = async (req, res, next) => {
  try {
    // extracts the token from request cookies
    const { token } = req.cookies;

    // return 401 if token is not there
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token missing, please login again." });
    }

    // verifies the token
    const decodedInfo = jwt.verify(token, process.env.SECRET_KEY);

    // Fetch user details
    const User = users[decodedInfo.role];
    const user = sanitizeUser(await User.findById(decodedInfo._id));
    logger.info(`User: ${JSON.stringify(user, null, 2)}`);

    // If user does not exist or is soft deleted
    if (!user || user.isDeleted) {
      logger.warn(`Invalid token used by ${req.ip}.\nToken: ${token}`);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user details to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Error verifying token: ${error.message}`);
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired, please login again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res
        .status(401)
        .json({ message: "Invalid token, please login again." });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};
