const PushSubscription = require("../models/push-model");
const {
    sendPushNotification
}=require("../utils/push-notification");
const savePushSubscription = async (req, res) => {
    try {
        const { endpoint, keys } = req.body;

        if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
            return res.status(400).json({
                message: "Invalid push subscription"
            });
        }

        const existingSubscription =
            await PushSubscription.findOne({
                endpoint
            });

        if (existingSubscription) {
            existingSubscription.userId = req.userID;
            existingSubscription.keys = keys;

            await existingSubscription.save();

            return res.status(200).json({
                message: "Push subscription updated successfully"
            });
        }

        await PushSubscription.create({
            userId: req.userID,
            endpoint,
            keys
        });

        res.status(201).json({
            message: "Push subscription saved successfully"
        });

    } catch (error) {
        console.error(
            "Save push subscription error:",
            error
        );

        res.status(500).json({
            message: "Failed to save push subscription"
        });
    }
};
const sendTestNotification = async (req, res) => {
    try {

        const subscriptions =
            await PushSubscription.find({
                userId: req.userID
            });

        if (subscriptions.length === 0) {
            return res.status(404).json({
                message: "No push subscription found"
            });
        }

        for (const subscription of subscriptions) {

            await sendPushNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: subscription.keys
                },
                {
                    title: "HopeWell City Hospital",
                    body: "🔔 This is a test notification."
                }
            );
        }

        res.status(200).json({
            message: "Test notification sent successfully"
        });

    } catch (error) {

        console.error(
            "Send test notification error:",
            error
        );

        res.status(500).json({
            message: "Failed to send notification"
        });
    }
};
module.exports = {
    savePushSubscription,
    sendTestNotification
};