import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Name"],
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Please enter Email"],
      unique: [true, "Email already Exist"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: [true, "Phone already Exist"],
      trim: true,
    },

    vehicle: {
      type: String,
      enum: ["Bike", "Car"],
      required: true,
    },

    password: {
      type: String,
      required: [true, "Please enter Password"],
      trim: true,
    },

    vehicleIssue: {
      type: String,
      trim: true,
      default: "",
    },

    garage: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true } // gets createdAt and updateAt
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = model("User", userSchema);
