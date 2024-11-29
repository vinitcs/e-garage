import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { responseHandling } from "../utils/responseHandling.js";

dotenv.config({
  path: "./.env"
});

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", ""); // Extract token

    if (!token) {
      return responseHandling(res, 401, "Access denied");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Add decoded token data (e.g., id) to request
    next();
  } catch (err) {
    return responseHandling(res, 401, "Invalid token.");
  }
};

export default authenticate;
