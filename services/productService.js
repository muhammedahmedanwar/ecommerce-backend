const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");

exports.uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ qualtiy: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // save image into db
    req.body.imageCover = imageCoverFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(600, 600)
          .toFormat("jpeg")
          .jpeg({ qualtiy: 90 })
          .toFile(`uploads/products/${imageName}`);

        // save image into db
        req.body.images.push(imageName);
      })
    );
    next();
  }
});

exports.getProducts = factory.getAll(ProductModel, "Products");

exports.getProduct = factory.getOne(ProductModel, "reviews");

exports.createProduct = factory.createOne(ProductModel);

exports.updateProduct = factory.updateOne(ProductModel);

exports.deleteProduct = factory.deleteOne(ProductModel);
