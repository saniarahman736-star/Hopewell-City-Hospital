import { useEffect } from "react";
import { useAuth } from "../store/auth";
const Notifications = () => {
    const { authorizationToken } = useAuth();
    useEffect(() => {
        const setupPushNotifications = async () => {
            try {
                if (!("Notification" in window)) {
                    console.log("Notifications are not supported.");
                    return;
                }
                if (!("serviceWorker" in navigator)) {
                    console.log("Service Worker is not supported.");
                    return;
                }
                const permission =
                    await Notification.requestPermission();
                if (permission !== "granted") {
                    console.log("Notification permission denied.");
                    return;
                }
                const registration =
                    await navigator.serviceWorker.ready;

                let subscription =
                    await registration.pushManager.getSubscription();

                if (!subscription) {

                    const publicKey =
                        import.meta.env.VITE_VAPID_PUBLIC_KEY;

                    if (!publicKey) {
                        console.error(
                            "VITE_VAPID_PUBLIC_KEY is missing."
                        );
                        return;
                    }

                    subscription =
                        await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: publicKey
                        });
                }

                console.log(
                    "Push subscription:",
                    subscription
                );

                const response = await fetch(
                    "http://localhost:5000/api/notifications/subscribe",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: authorizationToken
                        },

                        body: JSON.stringify({
                            endpoint: subscription.endpoint,
                            keys: {
                                p256dh:
                                    subscription.getKey("p256dh")
                                        ? btoa(
                                            String.fromCharCode(
                                                ...new Uint8Array(
                                                    subscription.getKey(
                                                        "p256dh"
                                                    )
                                                )
                                            )
                                        )
                                        : null,

                                auth:
                                    subscription.getKey("auth")
                                        ? btoa(
                                            String.fromCharCode(
                                                ...new Uint8Array(
                                                    subscription.getKey(
                                                        "auth"
                                                    )
                                                )
                                            )
                                        )
                                        : null
                            }
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    console.log(
                        "Push subscription saved:",
                        data.message
                    );
                } else {
                    console.error(
                        "Failed to save subscription:",
                        data.message
                    );
                }

            } catch (error) {

                console.error(
                    "Push notification setup error:",
                    error
                );

            }
        };

        if (authorizationToken) {
            setupPushNotifications();
        }

    }, [authorizationToken]);
    const sendTestNotification = async () => {
    try {
        const response = await fetch(
            "http://localhost:5000/api/notifications/test",
            {
                method: "POST",
                headers: {
                    Authorization: authorizationToken
                }
            }
        );

        const data = await response.json();

        console.log(data);

    } catch (error) {
        console.error("Test notification error:", error);
    }
};
    return (
        <div>
            <h1>Notifications</h1>
            <button onClick={sendTestNotification}>Test Notification</button>
        </div>
    );
};

export default Notifications;