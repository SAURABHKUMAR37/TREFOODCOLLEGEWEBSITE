
import mongoose from "mongoose";

// Structure of each food item inside an order
const orderItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        required: true
    }
});


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: {
        type: [orderItemSchema],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        default: "Food Processing"
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: Boolean,
        default: false
    }
});

const orderModel =
    mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
