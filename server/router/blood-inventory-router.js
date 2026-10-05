const express = require("express");
const router = express.Router();

const {
    getBloodInventory
} = require("../controller/blood-inventory-controller");

router.get("/", getBloodInventory);

module.exports = router;