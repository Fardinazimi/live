import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    price: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: [String], required: true },
    sizes: { type: [String], required: true },
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true },
    ratings: [
        { user: { type: String, required: true }, stars: { type: Number, required: true, min: 1, max: 5 }, comment: { type: String } }
    ],
    averageRating: { type: Number, default: 0 }
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
