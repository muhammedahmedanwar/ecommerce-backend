const expressAsyncHandler = require("express-async-handler");

const UserModel = require("../models/userModel");

exports.addProductToWishlist = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Product added successfully to your Wishlist",
    data: user.wishlist,
  });
});

exports.removeProductfromWishlist = expressAsyncHandler(
  async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true }
    );
    res.status(200).json({
      status: "Success",
      message: "Product removed successfully from your Wishlist",
      data: user.wishlist,
    });
  }
);

exports.getLoggedUserWishlist = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishlist");
  res.status(200).json({
    status: "Success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
