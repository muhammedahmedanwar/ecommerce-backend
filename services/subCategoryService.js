const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// nested route
// GET
exports.createFilter = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

exports.getSubCategories = factory.getAll(subCategoryModel, "subCategory");

exports.getSubCategory = factory.getOne(subCategoryModel);

exports.createSubCategory = factory.createOne(subCategoryModel);

exports.updateSubCategory = factory.updateOne(subCategoryModel);

exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
