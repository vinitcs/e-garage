import { responseHandling } from "../utils/responseHandling.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { adminLoginSchema } from "../utils/validation/inputValidator.js";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config({
  path: "./.env",
});

export const verifyAdminAuthenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.adminAccessToken;
    if (!token) {
      return responseHandling(res, 401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const admin = decodedToken.adminName;
    if (!admin) {
      return responseHandling(res, 401, "Invalid admin access token");
    }

    return responseHandling(res, 200, "Admin access token verified", {
      adminName: admin,
    });
  } catch (error) {
    next(error);
  }
};

// Admin login
export const loginAdmin = async (req, res, next) => {
  try {
    const validAdmin = await adminLoginSchema.validateAsync(req.body);
    const { adminName, password } = validAdmin;

    if (adminName !== process.env.ADMIN_NAME) {
      return responseHandling(res, 401, "Invalid adminName");
    }

    const isPasswordValid = bcrypt.compare(password, process.env.ADMIN_PASS);

    if (!isPasswordValid) {
      return responseHandling(res, 401, "Invalid password");
    }

    // Generate JWT
    const token = jwt.sign(
      { adminName: process.env.ADMIN_NAME },
      process.env.JWT_SECRET,
      {
        expiresIn: "10m",
      }
    );

    // Set the JWT token in a cookie
    res.cookie("adminAccessToken", token, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Allows the cookie to be sent in cross-origin requests
      maxAge: 10 * 60 * 1000,
      path: "/", // Makes the cookie accessible across the entire site
    });

    return responseHandling(res, 200, "Admin login successful", {
      adminName: process.env.ADMIN_NAME,
    });
  } catch (error) {
    if (error.isJoi) {
      return responseHandling(res, 400, error.message);
    }
    next(error);
  }
};

// Admin logout
export const logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie("adminAccessToken", {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true,
      sameSite: "Strict",
    });
    return responseHandling(res, 200, "Admin logout successful", {});
  } catch (err) {
    next(err);
  }
};

// Fetched all users data
export const getAllUsersData = async (req, res, next) => {
  try {
    const user = await User.find().select("-password");

    if (!user || user.length === 0) {
      return responseHandling(res, 404, "No student data found");
    }

    return responseHandling(res, 200, "User fetched successfully", { user });
  } catch (error) {
    next(error);
  }
};

// // Edit selected user feedback
export const updateUserGarageStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { garage } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return responseHandling(res, 404, "No student data found");
    }
    const editUserGarageStatus = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          garage,
        },
      },
      { new: true }
    );

    //     console.log(editUserGarageStatus.name);

    if (!editUserGarageStatus) {
      return responseHandling(
        res,
        404`Something went wrong while updating garage of the user email ${editUserGarageStatus.email}`
      );
    }
    return responseHandling(
      res,
      200,
      `User email ${editUserGarageStatus.email} garage status updated successfully`,
      {
        useData: {
          name: editUserGarageStatus.name,
          email: editUserGarageStatus.email,
          phone: editUserGarageStatus.phone,
          vehicle: editUserGarageStatus.vehicle,
          vehicleIssue: editUserGarageStatus.vehicleIssue,
          garage: editUserGarageStatus.garage,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};
