const cron = require("node-cron");

const Appointment = require("../models/appointment-model");
const Prescription = require("../models/prescription-model");
const PushSubscription = require("../models/push-model");
const NotificationLog = require("../models/notification-model");

const {
    sendPushNotification
} = require("./push-notification");


// ==========================================
// SEND PUSH NOTIFICATION
// ==========================================

const sendNotificationToUser = async (
    userId,
    title,
    body
) => {
    try {

        const subscriptions =
            await PushSubscription.find({
                userId
            });

        console.log(
            "📱 Subscriptions found:",
            subscriptions.length
        );

        if (subscriptions.length === 0) {
            console.log(
                "⚠️ No push subscription found for user:",
                userId
            );

            return false;
        }

        let success = false;

        for (const subscription of subscriptions) {

            const result =
                await sendPushNotification(
                    {
                        endpoint:
                            subscription.endpoint,

                        keys:
                            subscription.keys
                    },
                    {
                        title,
                        body
                    }
                );

            if (result) {
                success = true;
            }
        }

        return success;

    } catch (error) {

        console.error(
            "❌ Notification sending error:",
            error
        );

        return false;
    }
};


// ==========================================
// CHECK DUPLICATE NOTIFICATION
// ==========================================

const alreadySent = async (
    userId,
    type,
    referenceId,
    date
) => {

    const existing =
        await NotificationLog.findOne({
            userId,
            type,
            referenceId,
            date
        });

    return !!existing;
};


// ==========================================
// APPOINTMENT REMINDER
// ==========================================

const checkAppointments = async () => {

    try {

        const now = new Date();

        console.log(
            "📅 Checking appointments..."
        );

        console.log(
            "Current server date:",
            now.toString()
        );


        const tomorrow =
            new Date(now);

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );


        const dateString =
            tomorrow
                .toISOString()
                .split("T")[0];


        console.log(
            "Tomorrow date being checked:",
            dateString
        );


        const appointments =
            await Appointment.find({
                appointmentDate: dateString,

                status: {
                    $in: [
                        "Pending",
                        "Confirmed"
                    ]
                }
            });


        console.log(
            "Appointments found:",
            appointments.length
        );


        for (const appointment of appointments) {

            console.log(
                "📅 Appointment found:",
                appointment._id
            );


            const sent =
                await alreadySent(
                    appointment.patientId,
                    "appointment",
                    appointment._id,
                    dateString
                );


            if (sent) {

                console.log(
                    "⏭️ Appointment notification already sent"
                );

                continue;
            }


            const appointmentTime =
                Array.isArray(
                    appointment.appointmentTime
                )
                    ? appointment.appointmentTime.join(
                          ", "
                      )
                    : appointment.appointmentTime;


            const success =
                await sendNotificationToUser(
                    appointment.patientId,

                    "📅 Appointment Reminder",

                    `You have an appointment tomorrow at ${appointmentTime}.`
                );


            if (!success) {

                console.log(
                    "❌ Appointment notification failed"
                );

                continue;
            }


            await NotificationLog.create({

                userId:
                    appointment.patientId,

                type:
                    "appointment",

                referenceId:
                    appointment._id,

                date:
                    dateString

            });


            console.log(
                "✅ Appointment notification sent"
            );
        }

    } catch (error) {

        console.error(
            "❌ Appointment reminder error:",
            error
        );
    }
};


// ==========================================
// MEDICINE REMINDER
// ==========================================

const checkMedicines = async () => {

    try {

        const prescriptions =
            await Prescription.find({
                "medicines.0": {
                    $exists: true
                }
            });


        const now = new Date();

        const currentHour =
            now.getHours();

        const currentMinute =
            now.getMinutes();


        console.log(
            "💊 Checking medicines..."
        );

        console.log(
            "⏰ Server time:",
            now.toString()
        );

        console.log(
            "⏰ Current time:",
            `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`
        );


        console.log(
            "💊 Prescriptions found:",
            prescriptions.length
        );


        for (
            const prescription
            of prescriptions
        ) {

            for (
                let i = 0;
                i < prescription.medicines.length;
                i++
            ) {

                const medicine =
                    prescription.medicines[i];


                if (
                    !medicine.timings ||
                    medicine.timings.length === 0
                ) {

                    console.log(
                        "⚠️ No timings for:",
                        medicine.name
                    );

                    continue;
                }


                for (
                    const timing
                    of medicine.timings
                ) {

                    if (!timing) {
                        continue;
                    }


                    const timingText =
                        timing
                            .toString()
                            .trim()
                            .toUpperCase();


                    console.log(
                        "💊 Medicine:",
                        medicine.name,

                        "| Timing:",
                        timingText
                    );


                    const match =
                        timingText.match(
                            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/
                        );


                    if (!match) {

                        console.log(
                            "⚠️ Invalid timing format:",
                            timingText
                        );

                        continue;
                    }


                    let reminderHour =
                        parseInt(
                            match[1],
                            10
                        );


                    const reminderMinute =
                        parseInt(
                            match[2],
                            10
                        );


                    const period =
                        match[3];


                    // Convert AM/PM to 24-hour format

                    if (
                        period === "AM"
                    ) {

                        if (
                            reminderHour === 12
                        ) {

                            reminderHour = 0;
                        }

                    } else {

                        if (
                            reminderHour !== 12
                        ) {

                            reminderHour += 12;
                        }
                    }


                    console.log(
                        "🔎 Comparing:",
                        `${currentHour}:${currentMinute}`,

                        "with",

                        `${reminderHour}:${reminderMinute}`
                    );


                    if (
                        currentHour !==
                            reminderHour ||

                        currentMinute !==
                            reminderMinute
                    ) {

                        continue;
                    }


                    console.log(
                        "🎯 MEDICINE TIME MATCHED!"
                    );


                    const today =
                        now
                            .toISOString()
                            .split("T")[0];


                    const notificationType =
                        `medicine-${i}-${timingText}`;


                    const sent =
                        await alreadySent(

                            prescription.patientId,

                            notificationType,

                            prescription._id,

                            today
                        );


                    if (sent) {

                        console.log(
                            "⏭️ Medicine notification already sent"
                        );

                        continue;
                    }


                    const success =
                        await sendNotificationToUser(

                            prescription.patientId,

                            "💊 Medication Reminder",

                            `Remember to take ${medicine.name}${medicine.dosage ? ` (${medicine.dosage})` : ""}.${medicine.instructions ? ` ${medicine.instructions}` : ""}`
                        );


                    if (!success) {

                        console.log(
                            "❌ Medicine notification failed"
                        );

                        continue;
                    }


                    await NotificationLog.create({

                        userId:
                            prescription.patientId,

                        type:
                            notificationType,

                        referenceId:
                            prescription._id,

                        date:
                            today

                    });


                    console.log(
                        "✅ Medicine notification sent successfully!"
                    );
                }
            }
        }

    } catch (error) {

        console.error(
            "❌ Medicine reminder error:",
            error
        );
    }
};


// ==========================================
// START SCHEDULER
// ==========================================

const startNotificationScheduler = () => {

    cron.schedule(
        "* * * * *",
        async () => {

            console.log(
                "\n🔔 Checking hospital notifications..."
            );

            await checkAppointments();

            await checkMedicines();

            console.log(
                "✅ Notification check completed\n"
            );
        }
    );


    console.log(
        "🔔 Notification scheduler started"
    );
};


module.exports = {
    startNotificationScheduler
};