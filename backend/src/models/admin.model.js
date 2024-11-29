// import { model, Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";

// const adminSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please enter adminName"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       index: true,
//     },

//     email: {
//       type: String,
//       required: [true, "Please enter adminEmail"],
//       unique: [true, "Email already Exist"],
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: [true, "Please enter Password"],
//       trime: true,
//     },

//     // phone: {
//     //   type: String,
//     //   unique: [true, "Phone already Exist"],
//     //   trim: true,
//     //   default: "NA",
//     // },
//   },
//   { timestamps: true } // gets createdAt and updateAt
// );

// adminSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// adminSchema.methods.isPasswordCorrect = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

// adminSchema.methods.generateAdminAccessToken = function () {
//   return jwt.sign(
//     {
//       _id: this._id,
//       name: this.name,
//       email: this.email,
//     },
//     process.env.ADMIN_ACCESS_TOKEN_SECRET,
//     {
//       expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY,
//     }
//   );
// };

// export const Admin = model("Admin", adminSchema);
