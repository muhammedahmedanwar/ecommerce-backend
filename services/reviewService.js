const factory = require("./handlersFactory");
const reviewModel = require("../models/reviewModel");

// nested route
// GET
exports.createFilter = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};

exports.getReviews = factory.getAll(reviewModel, "Review");

exports.getReview = factory.getOne(reviewModel);

exports.setProductIdAndUserIdToBody = (req, res, next) => {
  // Nested route (create)
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createReview = factory.createOne(reviewModel);

exports.updateReview = factory.updateOne(reviewModel);

exports.deleteReview = factory.deleteOne(reviewModel);
