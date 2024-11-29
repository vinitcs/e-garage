import Joi from "joi";

// Sign Up validation
const userCreateSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).required(),
  vehicle: Joi.string().valid("Bike", "Car").required(),
  vehicleIssue: Joi.string().optional(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character, and be at least 8 characters long.",
    }),
});

// Login Validation
const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base": "Password is invalid. Try again!",
    }),
});



// user update validation
const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(new RegExp("^[0-9]{10}$")).optional(),
  vehicle: Joi.string().valid("Bike", "Car").optional(),
  vehicleIssue: Joi.string().optional(),
});

// admin Login Validation
const adminLoginSchema = Joi.object({
  adminName: Joi.string().min(3).required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\-]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base": "Password is invalid. Try again!",
    }),
});

export { userCreateSchema, userLoginSchema, userUpdateSchema, adminLoginSchema };