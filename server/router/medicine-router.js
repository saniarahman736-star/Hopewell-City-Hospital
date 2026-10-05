const express = require("express");
const router = express.Router();
const {
    getAllMedicines,
} = require("../controller/medicine-controller");

router.get("/", getAllMedicines);

module.exports = router;