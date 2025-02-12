import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

    // checks if decoded info contains legit details, then set that info in req.user and calls next
    if (decodedInfo && decodedInfo._id && decodedInfo.email) {
      req.user = decodedInfo;
      return next();
    }

    // sends 401 if the token is Invalid
    else {
      return res
        .status(401)
        .json({ message: "Invalid token, please login again." });
    }
  } catch (error) {
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
