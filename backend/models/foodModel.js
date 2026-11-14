
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  price: {
    type: Number,
    required: true,
    min: [0.01, "Price must be greater than zero"],
  },
  image: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
