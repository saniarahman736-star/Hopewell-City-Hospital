const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            required: true
        },

        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        date: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "NotificationLog",
    notificationLogSchema
);