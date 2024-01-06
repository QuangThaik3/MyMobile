const mongoose = require("mongoose");

const ProductSchemas = new mongoose.Schema(
    {
        topic: { type: String, required: true },
        category: { type: String, required: true },
        type: { type: String},
        title: { type: String, required: true},
        size: { type: String, },
        color: { type: Array, },
        img: { type: Array, required: true },
        price: { type: Array, required: true},
        discount: { type: Number, required: true }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Products", ProductSchemas);
