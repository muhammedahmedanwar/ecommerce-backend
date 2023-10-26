const mongoose = require("mongoose");

// 1-create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minLength: [3, "Too short Brand name"],
      maxLength: [32, "Too long Brand name"],
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
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2-create model
module.exports = mongoose.model("Brand", brandSchema);
