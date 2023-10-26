const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const CategoryModel = require("../models/categoryModel");

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ qualtiy: 90 })
      .toFile(`uploads/categories/${filename}`);

    // save image into db
    req.body.image = filename;
  }
  next();
});

exports.getCategories = factory.getAll(CategoryModel, "Category");

exports.getCategory = factory.getOne(CategoryModel);

exports.createCategory = factory.createOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);
