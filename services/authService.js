const crypto = require("crypto");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");

const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

exports.signup = expressAsyncHandler(async (req, res, next) => {
  // create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //   generate token
  const token = createToken(user._id);
  res.status(201).json({ data: user, token });
});

exports.login = expressAsyncHandler(async (req, res, next) => {
  // check if user and password (valid)
  // check if user exist & password is correct
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // generate token
  const token = createToken(user._id);
  // Delete password from response
  delete user._doc.password;
  // send response to client side
  res.status(200).json({ data: user, token });
});

exports.protect = expressAsyncHandler(async (req, res, next) => {
  // check if token exist and get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access this route",
        401
      )
    );
  }
  // check token valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // check user exist
  const currentUser = await UserModel.findById(decoded.userId);
  // check user active or not
  if (!currentUser.active) {
    return next(
      new ApiError("You are not active, please activate your account", 401)
    );
  }
  if (!currentUser) {
    return next(
      new ApiError("User that belong to this token doesn't longer exist"),
      401
    );
  }
  // check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again..."
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    // access role
    // access registered user
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

exports.forgotPassword = expressAsyncHandler(async (req, res, next) => {
  // get user by email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`),
      404
    );
  }
  // if user exist, generate reset random code and save in db
  const resetCode = Math.floor(Math.random() * 900000).toString();
  const hashResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save reset code to db
  user.passwordResetCode = hashResetCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordVerified = false;
  await user.save();
  // send reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure. \n The E-shop Team.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email." });
});

exports.verifyPassResetCode = expressAsyncHandler(async (req, res, next) => {
  // get user based on reset code
  const hashResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await UserModel.findOne({
    passwordResetCode: hashResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired", 404));
  }
  // reset code valid
  user.passwordVerified = true;
  await user.save();
  res.status(200).json({ status: "Success" });
});

exports.resetPassword = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`),
      404
    );
  }
  if (!user.passwordVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordVerified = undefined;
  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});
