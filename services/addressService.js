const expressAsyncHandler = require("express-async-handler");

const UserModel = require("../models/userModel");

exports.addAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { adresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Address added successfully",
    data: user.adresses,
  });
});

exports.removeAddress = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { adresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "Success",
    message: "Address removed successfully",
    data: user.adresses,
  });
});

exports.getLoggedUserAddresses = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("adresses");
  res.status(200).json({
    status: "Success",
    results: user.adresses.length,
    data: user.adresses,
  });
});
