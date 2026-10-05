import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./DoctorProfile.css";

export const DoctorProfile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        specialization: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        availableDays: [],
        availableTime: ""
    });

    const [loading, setLoading] = useState(true);
    const [profileExists, setProfileExists] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/doctor/my-profile",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                const result = await response.json();
                const doctor = result.data;

                setProfile({
                    specialization: doctor.specialization || "",
                    qualification: doctor.qualification || "",
                    experience: doctor.experience || "",
                    consultationFee: doctor.consultationFee || "",
                    availableDays: doctor.availableDays || [],
                    availableTime: doctor.availableTime
                        ? doctor.availableTime.join(" - ")
                        : ""
                });

                setProfileExists(true);
            } else {
                setProfileExists(false);
            }

        } catch (error) {
            console.log("Doctor profile not found yet");
            setProfileExists(false);
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;

        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleDayChange = (day) => {
        if (profile.availableDays.includes(day)) {
            setProfile({
                ...profile,
                availableDays: profile.availableDays.filter(
                    item => item !== day
                )
            });
        } else {
            setProfile({
                ...profile,
                availableDays: [
                    ...profile.availableDays,
                    day
                ]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (profile.availableDays.length === 0) {
            toast.error("Please select at least one available day");
            return;
        }

        if (!profile.availableTime) {
            toast.error("Please enter your available time");
            return;
        }

        try {
            const timeArray = profile.availableTime
                .split("-")
                .map((time) => time.trim());

            const dataToSend = {
                specialization: profile.specialization,
                qualification: profile.qualification,
                experience: Number(profile.experience),
                consultationFee: Number(profile.consultationFee),
                availableDays: profile.availableDays,
                availableTime: timeArray
            };

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/doctor/my-profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSend)
                }
            );

            const result = await response.json();

            if (response.ok) {
                toast.success("Doctor profile saved successfully!");

                setProfileExists(true);
                setEditMode(false);

            } else {
                toast.error(
                    result.msg || "Failed to save doctor profile"
                );
            }

        } catch (error) {
            console.log("Save profile error:", error);
            toast.error("Something went wrong while saving profile");
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                Loading Profile...
            </div>
        );
    }

    /* ==========================
       SAVED PROFILE VIEW
    ========================== */

    if (profileExists && !editMode) {
        return (
            <div className="doctor-profile-page">

                <div className="doctor-profile-card">

                    <div className="profile-header">

                        <div className="doctor-icon">
                            🧑‍⚕️
                        </div>

                        <div>
                            <h1>Doctor Profile</h1>
                            <p>Your professional information</p>
                        </div>

                    </div>

                    <div className="saved-profile">

                        <div className="saved-profile-item">
                            <span>🩺 Specialization</span>
                            <strong>{profile.specialization}</strong>
                        </div>

                        <div className="saved-profile-item">
                            <span>🎓 Qualification</span>
                            <strong>{profile.qualification}</strong>
                        </div>

                        <div className="saved-profile-item">
                            <span>💼 Experience</span>
                            <strong>{profile.experience} years</strong>
                        </div>

                        <div className="saved-profile-item">
                            <span>💰 Consultation Fee</span>
                            <strong>₹{profile.consultationFee}</strong>
                        </div>

                        <div className="saved-profile-item">
                            <span>📅 Available Days</span>
                            <strong>
                                {profile.availableDays.join(", ")}
                            </strong>
                        </div>

                        <div className="saved-profile-item">
                            <span>⏱️ Available Time</span>
                            <strong>
                                {profile.availableTime}
                            </strong>
                        </div>

                    </div>

                    <div className="profile-actions">

                        <button
                            className="edit-profile-btn"
                            onClick={() => setEditMode(true)}
                        >
                            ✏️ Edit Profile
                        </button>

                        <button
                            className="back-dashboard-btn"
                            onClick={() =>
                                navigate("/doctor-dashboard")
                            }
                        >
                            🏠 Dashboard
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    /* ==========================
       CREATE / EDIT PROFILE FORM
    ========================== */

    return (
        <div className="doctor-profile-page">

            <div className="doctor-profile-card">

                <div className="profile-header">

                    <div className="doctor-icon">
                        🧑‍⚕️
                    </div>

                    <div>
                        <h1>
                            {profileExists
                                ? "Edit Doctor Profile"
                                : "Doctor Profile"}
                        </h1>

                        <p>
                            {profileExists
                                ? "Update your professional information"
                                : "Complete your professional information"}
                        </p>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="profile-grid">

                        <div className="profile-field">

                            <label>
                                🩺 Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                placeholder="e.g. Cardiologist"
                                value={profile.specialization}
                                onChange={handleInput}
                                required
                            />

                        </div>

                        <div className="profile-field">

                            <label>
                                🎓 Qualification
                            </label>

                            <input
                                type="text"
                                name="qualification"
                                placeholder="e.g. MBBS MD"
                                value={profile.qualification}
                                onChange={handleInput}
                                required
                            />

                        </div>

                        <div className="profile-field">

                            <label>
                                💼 Experience
                            </label>

                            <input
                                type="number"
                                name="experience"
                                placeholder="Years of experience"
                                min="0"
                                value={profile.experience}
                                onChange={handleInput}
                                required
                            />

                        </div>

                        <div className="profile-field">

                            <label>
                                💰 Consultation Fee
                            </label>

                            <input
                                type="text"
                                name="consultationFee"
                                placeholder="e.g. 500"
                                min="0"
                                value={profile.consultationFee}
                                onChange={handleInput}
                                required
                            />

                        </div>

                        <div className="profile-field days-section">

                            <label>
                                📅 Available Days
                            </label>

                            <div className="days-container">

                                {days.map((day) => (

                                    <label
                                        className={`day-option ${
                                            profile.availableDays.includes(day)
                                                ? "selected"
                                                : ""
                                        }`}
                                        key={day}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={profile.availableDays.includes(day)}
                                            onChange={() =>
                                                handleDayChange(day)
                                            }
                                        />

                                        <span>{day}</span>

                                    </label>

                                ))}

                            </div>

                        </div>

                        <div className="profile-field">

                            <label>
                                ⏱️ Available Time
                            </label>

                            <input
                                type="text"
                                name="availableTime"
                                placeholder="e.g. 10:00 AM - 4:00 PM"
                                value={profile.availableTime}
                                onChange={handleInput}
                                required
                            />

                        </div>

                    </div>

                    <div className="profile-actions">

                        <button
                            type="submit"
                            className="save-profile-btn"
                        >
                            💾 Save Profile
                        </button>

                        {profileExists && (
                            <button
                                type="button"
                                className="cancel-profile-btn"
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

        </div>
    );
};

export default DoctorProfile;