const mongoose = require("mongoose");
const bloodInventorySchema = new mongoose.Schema(
    {
        bloodGroup: {
            type: String,
            required: true,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            unique: true
        },

        unitsAvailable: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },

        hospital: {
            type: String,
            required: true,
            default: "HopeWell City Hospital"
        },

        location: {
            type: String,
            required: true,
            default: "Kolkata, West Bengal"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("BloodInventory", bloodInventorySchema);