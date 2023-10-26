const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "Subcategory must be unique"],
      minLength: [2, "Too short subcategory name"],
      maxLength: [32, "Too long subcategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be belong to parent category"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subcategory", subCategorySchema);
