const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const expressAsyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// image processing
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ qualtiy: 90 })
    .toFile(`uploads/brands/${filename}`);

  // save image into db
  req.body.image = filename;
  next();
});

exports.getBrands = factory.getAll(BrandModel, "Brand");

exports.getBrand = factory.getOne(BrandModel);

exports.createBrand = factory.createOne(BrandModel);

exports.updateBrand = factory.updateOne(BrandModel);

exports.deleteBrand = factory.deleteOne(BrandModel);
