const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    customer: {
        type: String,
        required: true
    },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            total: { type: Number, required: true }
        }
    ],
    TotalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"], 
        default: "pending" 
    },
    customerEmail: { type: String }, // Store customer email for notifications
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" }, // Reference to customer
    adminNote: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);