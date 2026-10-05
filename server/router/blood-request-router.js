const express = require("express");
const router = express.Router();
const {
    createBloodRequest,
    getMyBloodRequests
} = require("../controller/blood-request-controller");
const authMiddleware=require("../middlewares/auth-middleware");
router.post("/", authMiddleware,createBloodRequest);
router.get("/my-requests",authMiddleware, getMyBloodRequests);
module.exports = router;