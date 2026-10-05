const express = require("express");
const router = express.Router();
const {
    savePushSubscription,sendTestNotification
} = require("../controller/push-controller");
const authMiddleware = require("../middlewares/auth-middleware");
router.post(
    "/subscribe",
    authMiddleware,
    savePushSubscription
);
router.post(
    "/test",
    authMiddleware,
    sendTestNotification
);
module.exports = router;