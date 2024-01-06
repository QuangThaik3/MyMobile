const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        orderID: { type: String, required: true, unique: true },
        userId: { type: String },
        ten: { type: String },
        email: { type: String },
        tel: { type: String },
        address: { type: String },
        house: { type: String },
        check: { type: String },
        product: [
            {
                productId: { type: String },
                title: { type: String },
                color: { type: String },
                quantity: { type: Number },
                price: { type: Number },
                size: { type: String },
            },
        ],
        total: { type: Number },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);