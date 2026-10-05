const Medicine = require("../models/medicine-model");

const getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ createdAt: -1 });

        res.status(200).json({
            data: medicines,
        });
    } catch (error) {
        console.log("GET MEDICINES ERROR:", error);

        res.status(500).json({
            message: "Unable to fetch medicines",
        });
    }
};

module.exports = {
    getAllMedicines,
};