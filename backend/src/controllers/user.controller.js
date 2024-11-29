import { User } from "../models/user.model.js";
import { responseHandling } from "../utils/responseHandling.js";
import {
  userCreateSchema,
  userLoginSchema,
  userUpdateSchema,
} from "../utils/validation/inputValidator.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();

    return { accessToken };
  } catch (error) {
    // throw new ApiError(
    //   500,
    //   "Something went wrong while generating refresh and access token"
    // );
    return responseHandling(
      res,
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const verifyJwtToken = async (req, res) => {
  const token = req.cookies.accessToken || req.body.accessToken;

  try {
    if (!token) {
      // throw new ApiError(401, "Unauthorized request");
      return responseHandling(res, 401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      // throw new ApiError(401, "Invalid access token");
      return responseHandling(res, 401, "User does not exist");
    }

    return responseHandling(res, 200, "Access token verified", {
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        vehicle: user.vehicle,
        vehicleIssue: user.vehicleIssue,
        garage: user.garage,
      },
    });
  } catch (error) {
    // throw new ApiError(401, error.message || "Invalid access token");
    return responseHandling(res, 401, "Invalid access token");
  }
};

// User Sign Up
export const createUser = async (req, res, next) => {
  try {
    const validUser = await userCreateSchema.validateAsync(req.body);
    const { name, email, phone, vehicle, vehicleIssue, password } = validUser;

    const existedUser = await User.findOne({
      $or: [{ email }],
    });

    // Check if already present user in db or not
    if (existedUser) {
      // throw new ApiError(409, "Student with collegeEmail already exists");
      return responseHandling(
        res,
        409,
        "Student with collegeEmail already exists"
      );
    }

    // create user document in db
    const user = await User.create({
      name,
      email,
      phone,
      vehicle,
      vehicleIssue,
      password,
    });

    return responseHandling(res, 201, "User created successfully", {
      userData: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        vehicle: user.vehicle,
        vehicleIssue: user.vehicleIssue,
      },
    });
  } catch (error) {
    if (error.isJoi) {
      // Joi validation error
      return responseHandling(res, 400, error.message);
    }

    if (error.code === "23505") {
      // Postgres unique constraint error
      return responseHandling(res, 409, error.message);
    }
    next(error);
  }
};

// User Login
export const loginUser = async (req, res, next) => {
  try {
    const validUser = await userLoginSchema.validateAsync(req.body);
    const { email, password } = validUser;

    if (!email) {
      return responseHandling(res, 401, "Email is required");
    }
    const user = await User.findOne({
      $or: [{ email }],
    });

    if (!user) {
      return responseHandling(res, 401, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return responseHandling(res, 401, "Invalid  password");
    }

    const { accessToken } = await generateAccessToken(user._id);

    // Set the JWT token in a cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Allows the cookie to be sent in cross-origin requests
      maxAge: 5 * 60 * 1000,
      path: "/", // Makes the cookie accessible across the entire site
    });

    return responseHandling(res, 200, "Login successful", {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.isJoi) {
      return responseHandling(res, 400, error.message);
    }
    next(error);
  }
};

// User logged data
export const loggedUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return responseHandling(res, 401, "User not authenticated");
    }

    return responseHandling(
      res,
      200,
      "Current user data fetched successfully",
      {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          vehicle: user.vehicle,
          vehicleIssue: user.vehicleIssue,
          garage: user.garage,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

// User Logout
export const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true, // Prevents access to the cookie via JavaScript
      secure: true, // Ensures the cookie is only sent over HTTPS
      sameSite: "None", // Allows the cookie to be sent in cross-origin requests
      path: "/", // Makes the cookie accessible across the entire site
    });
    return responseHandling(res, 200, "Logout successful", {});
  } catch (err) {
    next(err);
  }
};

// User details
export const updateUser = async (req, res, next) => {
  try {
    const validUser = await userUpdateSchema.validateAsync(req.body);
    const { name, email, phone, vehicle, vehicleIssue } = validUser;

    const validVehicleTypeValues = ["Bike", "Car"];

    if (vehicle && !validVehicleTypeValues.includes(vehicle)) {
      // throw new ApiError(401, "Value of vehicle is not under predefined value");
      return responseHandling(
        res,
        401,
        "Value of vehicle is not under predefined value"
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          name,
          email,
          phone,
          vehicle,
          vehicleIssue,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      // throw new ApiError(
      //   res,
      //   404,
      //   "Something went wrong while updating the user"
      // );
      return responseHandling(
        res,
        404,
        "Something went wrong while updating the user"
      );
    }
    return responseHandling(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete user account
export const deleteUser = async (req, res, next) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    if (!deleteUser) return responseHandling(res, 404, "User not found");
    responseHandling(res, 200, "User deleted successfully", {
      deleteUserData: {
        id: deleteUser._id,
        name: deleteUser.name,
        email: deleteUser.email,
        vehicle: deleteUser.vehicle,
        vehicleIssue: user.vehicleIssue,
        garage: deleteUser.garage,
      },
    });
  } catch (error) {
    next(error);
  }
};
