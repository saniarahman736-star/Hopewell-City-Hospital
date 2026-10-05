import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./PatientDetails.css";
export const PatientDetails = () => {

    const { id } = useParams();
    const { authorizationToken } = useAuth();
    const navigate = useNavigate();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPatientDetails();
    }, []);

    const getPatientDetails = async () => {
        try {

            const response = await fetch(
                `http://localhost:5000/api/patients/${id}`,
                {
                    headers: {
                        Authorization: authorizationToken
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPatient(data.data);
            }

        } catch (error) {
            console.log("Patient details error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading Patient Profile...
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="dashboard-loading">
                Patient profile not found
            </div>
        );
    }

    return (
        <div className="patient-details-page">

            <button
                onClick={() => navigate("/doctor-dashboard")}
            >
                ← Back to Dashboard
            </button>

            <div className="patient-details-card">

                <div className="patient-details-header">
                    <div className="patient-details-avatar">
                        👤
                    </div>

                    <div>
                        <h1>
                            {patient.userId?.username}
                        </h1>

                        <p>
                            Patient Profile
                        </p>
                    </div>
                </div>

                <div className="patient-details-grid">

                    <div>
                        <label>Email</label>
                        <p>{patient.userId?.email}</p>
                    </div>

                    <div>
                        <label>Phone</label>
                        <p>{patient.userId?.phone}</p>
                    </div>

                    <div>
                        <label>Age</label>
                        <p>{patient.age}</p>
                    </div>

                    <div>
                        <label>Gender</label>
                        <p>{patient.gender}</p>
                    </div>

                    <div>
                        <label>Blood Group</label>
                        <p>{patient.bloodGroup}</p>
                    </div>

                    <div>
                        <label>Emergency Contact</label>
                        <p>{patient.emergencyContact}</p>
                    </div>

                    <div className="full-width">
                        <label>Address</label>
                        <p>{patient.address}</p>
                    </div>

                    <div className="full-width">
                        <label>Allergies</label>
                        <p>
                            {Array.isArray(patient.allergies)
                                ? patient.allergies.join(", ")
                                : patient.allergies || "None"}
                        </p>
                    </div>

                    <div className="full-width">
                        <label>Medical History</label>
                        <p>
                            {Array.isArray(patient.medicalHistory)
                                ? patient.medicalHistory.join(", ")
                                : patient.medicalHistory || "None"}
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default PatientDetails;