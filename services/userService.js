const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

// image processing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ qualtiy: 90 })
      .toFile(`uploads/users/${filename}`);

    // save image into db
    req.body.profileImg = filename;
  }
  next();
});

exports.getUsers = factory.getAll(UserModel, "User");

exports.getUser = factory.getOne(UserModel);

exports.createUser = factory.createOne(UserModel);

exports.updateUser = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = expressAsyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.deleteUser = factory.deleteOne(UserModel);

exports.getLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = expressAsyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
  }
);

exports.updateLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ data: updatedUser });
});

exports.deleteLoggedUserData = expressAsyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({ status: "Success" });
});
