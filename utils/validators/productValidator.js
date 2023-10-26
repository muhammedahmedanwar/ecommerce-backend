const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const SubcategoryModel = require("../../models/subCategoryModel");

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3")
    .notEmpty()
    .withMessage("Product required")
    .isLength({ max: 100 })
    .withMessage("Too long product name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((subcategoriesId) =>
      SubcategoryModel.find({
        _id: { $exists: true, $in: subcategoriesId },
      }).then((result) => {
        if (result.length < 1 || result.length !== subcategoriesId.length) {
          return Promise.reject(
            new Error(`No subcategory for this id: ${subcategoriesId}`)
          );
        }
      })
    )
    .custom((val, { req }) =>
      SubcategoryModel.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subcategory) => {
            subcategoriesIdsInDB.push(subcategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subcategoriesIdsInDB)) {
            return Promise.reject(
              new Error("Subcategory not found in this category")
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingsQuantity must be a number"),

  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
];
