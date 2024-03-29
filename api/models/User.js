const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        ten: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dienThoai: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, },
        img: { type: String },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);