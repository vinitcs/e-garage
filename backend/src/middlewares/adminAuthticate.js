import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { responseHandling } from "../utils/responseHandling.js";

dotenv.config();

const adminAuthenticate = (req, res, next) => {
  try {
    const token =
      req.cookies?.adminAccessToken ||
      req.header("Authorization")?.replace("Bearer", ""); // Extract token

    if (!token) {
      return responseHandling(res,401,"Admin access denied");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add decoded token data (e.g., id) to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export default adminAuthenticate;
