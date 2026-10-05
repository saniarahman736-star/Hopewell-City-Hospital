import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";
export const Appointment = () => {
    const { authorizationToken } = useAuth();

    const [doctors, setDoctors] = useState([]);

    const [appointment, setAppointment] = useState({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    const navigate = useNavigate();
    const getDoctors = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/doctor"
            );

            const data = await response.json();

            if (response.ok) {
                setDoctors(data.data);
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log("Get doctors error:", error);
        }
    };

    useEffect(() => {
        getDoctors();
    }, []);

    const handleInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setAppointment({
            ...appointment,
            [name]: value,
        });
    };
    const selectDoctor = doctors.find(
        (doctor) => doctor._id === appointment.doctorId
    );
    const generateTimeSlots = (startTime, endTime) => {
        const slots = [];

        const convertToMinutes = (time) => {
            if (!time) return 0;

            time = time.trim().toUpperCase();

            const [timePart, modifier] = time.split(" ");

            let [hours, minutes] = timePart
                .split(":")
                .map(Number);

            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            }

            if (modifier === "AM" && hours === 12) {
                hours = 0;
            }

            return hours * 60 + minutes;
        };

        const convertToTime = (minutes) => {
            let hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            const modifier = hours >= 12 ? "PM" : "AM";

            if (hours > 12) {
                hours -= 12;
            }

            if (hours === 0) {
                hours = 12;
            }

            return `${hours}:${mins
                .toString()
                .padStart(2, "0")} ${modifier}`;
        };

        let current = convertToMinutes(startTime);
        const end = convertToMinutes(endTime);

        while (current < end) {
            slots.push(convertToTime(current));
            current += 30;
        }

        return slots;
    };

    // ================================
    // HANDLE SUBMIT
    // ================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:5000/api/appointments/appointment",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: authorizationToken,
                    },

                    body: JSON.stringify(appointment),
                }
            );

            const res_data = await response.json();

            console.log("Response from server:", res_data);

            if (response.ok) {
                setAppointment({
                    doctorId: "",
                    appointmentDate: "",
                    appointmentTime: "",
                    reason: "",
                });

                toast.success("Appointment Booking Confirmed");

                navigate("/appointment/view");
            } else {
                toast.error(
                    res_data.extraDetails
                        ? res_data.extraDetails
                        : res_data.message || res_data.msg
                );
            }
        } catch (error) {
            console.log("Booking Confirmation Error:", error);

            toast.error(
                "Something went wrong while booking appointment"
            );
        }
    };

    // ================================
    // DEBUG
    // ================================

    console.log("Selected Doctor:", selectDoctor);
    console.log(
        "Available Time:",
        selectDoctor?.availableTime
    );

    // ================================
    // JSX
    // ================================

    return (
        <>
            <div className="appointment-form">

                <h1 className="main-heading">
                    Book An Appointment
                </h1>

                <br />

                <form onSubmit={handleSubmit}>

                    {/* ================= DOCTOR ================= */}

                    <div className="input-group">

                        <label>
                            Select Doctor
                        </label>

                        <select
                            name="doctorId"
                            value={appointment.doctorId}
                            onChange={handleInput}
                            required
                            autoComplete="off"
                        >

                            <option value="">
                                Select a Doctor
                            </option>

                            {doctors.map((doctor) => (
                                <option
                                    key={doctor._id}
                                    value={doctor._id}
                                >
                                    {doctor.userId?.username} -
                                    {" "}
                                    {doctor.specialization}
                                </option>
                            ))}

                        </select>

                    </div>

                    {/* ================= DATE ================= */}

                    <div className="input-group">

                        <label htmlFor="appointmentDate">
                            Appointment Date
                        </label>

                        <input
                            type="date"
                            name="appointmentDate"
                            value={appointment.appointmentDate}
                            onChange={handleInput}
                            required
                            autoComplete="off"
                        />

                    </div>

                    {/* ================= TIME ================= */}

                    <div className="input-group">

                        <label htmlFor="appointmentTime">
                            Appointment Time
                        </label>

                        <select
                            name="appointmentTime"
                            value={appointment.appointmentTime}
                            onChange={handleInput}
                            required
                        >

                            <option value="">
                                Select Time
                            </option>

                            {selectDoctor?.availableTime?.length >= 2 &&
                                generateTimeSlots(
                                    selectDoctor.availableTime[0],
                                    selectDoctor.availableTime[1]
                                ).map((time, index) => (

                                    <option
                                        key={index}
                                        value={time}
                                    >
                                        {time}
                                    </option>

                                ))
                            }

                        </select>

                    </div>

                    {/* ================= REASON ================= */}

                    <div className="input-group">

                        <label htmlFor="reason">
                            Reason
                        </label>

                        <textarea
                            name="reason"
                            rows="5"
                            placeholder="Kindly mention the reason"
                            value={appointment.reason}
                            onChange={handleInput}
                            required
                            autoComplete="off"
                        />

                    </div>

                    {/* ================= SUBMIT ================= */}

                    <button type="submit">
                        Confirm Your Appointment
                    </button>

                </form>

            </div>

            <footer>
                <p>
                    © 2026 HopeWell City Hospital.
                    All Rights Reserved.
                </p>
            </footer>
        </>
    );
};

export default Appointment;