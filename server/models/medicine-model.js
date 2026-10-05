const mongoose = require("mongoose");
const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
        },

        image: {
            type: String,
            default: "",
        },

        prescriptionRequired: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Medicine", medicineSchema);