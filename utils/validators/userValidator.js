const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.createUserValidator = [
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

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Eg phone number"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("name")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Eg phone number"),

  check("profileImg").optional(),

  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("You must enter your current password"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("You must enter the password confirm"),
  body("password")
    .notEmpty()
    .withMessage("You must enter new password")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  body("name")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Invalid phone number only accepted Eg phone number"),

  validatorMiddleware,
];
