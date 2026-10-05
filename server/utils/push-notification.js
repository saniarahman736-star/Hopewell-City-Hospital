const webpush = require("web-push");

webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const sendPushNotification = async (subscription, notification) => {
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify(notification)
        );

        return true;

    } catch (error) {
        console.error(
            "Push notification error:",
            error
        );

        return false;
    }
};

module.exports = {
    sendPushNotification
};