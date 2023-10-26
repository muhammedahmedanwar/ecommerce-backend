const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("user required")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom((val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in user"));
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("passwordConfirm required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validatorMiddleware,
];
