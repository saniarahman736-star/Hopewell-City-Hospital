const BloodInventory = require("../models/BloodInventory");

const getBloodInventory = async (req, res) => {
    try {
        const inventory = await BloodInventory.find().sort({
            bloodGroup: 1
        });

        res.status(200).json({
            message: "Blood inventory fetched successfully",
            inventory
        });

    } catch (error) {
        console.error("Get blood inventory error:", error);

        res.status(500).json({
            message: "Failed to fetch blood inventory"
        });
    }
};

module.exports = {
    getBloodInventory
};