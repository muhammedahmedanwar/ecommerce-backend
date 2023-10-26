const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name must be required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire must be required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount must be required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);