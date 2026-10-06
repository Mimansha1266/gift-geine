import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
      trim: true,
    },
    sellerName: {
      type: String,
      default: "Seller",
      trim: true,
    },
    sellerEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    purchaseUrl: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "Personalized Gift",
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
