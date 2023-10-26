const mongoose = require("mongoose");

// 1-create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minLength: [3, "Too short Category name"],
      maxLength: [32, "Too long Category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// mongoose query middleware
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2-create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
