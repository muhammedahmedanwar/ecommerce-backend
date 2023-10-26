const express = require("express");

const authService = require("../services/authService");

const {
  addProductToWishlist,
  removeProductfromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductfromWishlist);

module.exports = router;
