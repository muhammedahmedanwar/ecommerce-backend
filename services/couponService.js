const expressAsyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const CouponModel = require("../models/couponModel");

exports.getCoupons = factory.getAll(CouponModel, "Coupon");

exports.getCoupon = factory.getOne(CouponModel);

exports.createCoupon = factory.createOne(CouponModel);

exports.updateCoupon = factory.updateOne(CouponModel);

exports.deleteCoupon = factory.deleteOne(CouponModel);
