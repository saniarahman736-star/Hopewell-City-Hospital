const mongoose = require("mongoose");
const vitalSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },

        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },

        heartRate: {
            type: Number,
        },

        systolicBP: {
            type: Number,
        },

        diastolicBP: {
            type: Number,
        },

        temperature: {
            type: Number,
        },

        oxygenLevel: {
            type: Number,
        },

        respiratoryRate: {
            type: Number,
        },

        weight: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Vital", vitalSchema);