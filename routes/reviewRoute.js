const express = require("express");
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  createFilter,
  setProductIdAndUserIdToBody,
} = require("../services/reviewService");

const authService = require("../services/authService");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilter, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
