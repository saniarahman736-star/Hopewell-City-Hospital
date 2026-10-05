import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./PatientPrescription.css";

const PatientPrescription = () => {
    const { authorizationToken, user } = useAuth();
    const navigate = useNavigate();

    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPrescriptions = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/prescriptions/my",
                    {
                        method: "GET",
                        headers: {
                            Authorization: authorizationToken,
                        },
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setPrescriptions(data.data || []);
                } else {
                    setPrescriptions([]);
                }
            } catch (error) {
                console.log("Prescriptions error:", error);
                setPrescriptions([]);
            } finally {
                setLoading(false);
            }
        };

        if (authorizationToken) {
            getPrescriptions();
        }
    }, [authorizationToken]);

    if (loading) {
        return (
            <div className="patient-prescriptions-page">
                <h2>Loading Prescription...</h2>
            </div>
        );
    }

    return (
        <div className="patient-prescriptions-page">

            <button
                className="back-dashboard-btn"
                onClick={() => navigate("/patient/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <div className="prescription-page-header">
                <h1>📝 My Prescription</h1>
                <p>
                    Your prescriptions issued by HopeWell City Hospital
                </p>
            </div>

            {prescriptions.length === 0 ? (
                <div className="no-prescription">
                    <span>📝</span>

                    <h2>No Prescriptions available</h2>

                    <p>
                        Your prescription will appear here after your
                        doctor creates one.
                    </p>
                </div>
            ) : (
                <div className="prescription-list">

                    {prescriptions.slice(0,1).map((prescription) => (

                        <div
                            className="prescription-document"
                            key={prescription._id}
                        >

                            {/* Hospital Header */}
                            <div className="hospital-header">

                                <div className="hospital-logo">
                                    🏥
                                </div>

                                <div>
                                    <h2>HopeWell City Hospital</h2>

                                    <p>
                                        Kolkata, West Bengal, India
                                    </p>

                                    <p>
                                        📞 +91 9876543210
                                    </p>

                                    <p>
                                        ✉️ support@hopewehospital.com
                                    </p>
                                </div>

                            </div>

                            <div className="document-line"></div>

                            <h1 className="prescription-title">
                                PRESCRIPTION
                            </h1>

                            {/* Patient + Doctor */}
                            <div className="patient-doctor-info">

                                <div>
                                    <h3>Patient Details</h3>

                                    <p>
                                        <strong>Name:</strong>{" "}
                                        {user?.username || "Patient"}
                                    </p>

                                    <p>
                                        <strong>Email:</strong>{" "}
                                        {user?.email || "Not Available"}
                                    </p>
                                </div>

                                <div>
                                    <h3>Doctor Details</h3>

                                    <p>
                                        <strong>Doctor:</strong>{" "}
                                        {prescription.doctorId?.userId
                                            ?.username || "Doctor"}
                                    </p>

                                    <p>
                                        <strong>Phone:</strong>{" "}
                                        {prescription.doctorId?.userId
                                            ?.phone || "Not Available"}
                                    </p>
                                </div>

                            </div>

                            {/* Prescription Details */}
                            <div className="prescription-details">

                                <h3>Diagnosis</h3>

                                <p>
                                    {prescription.diagnosis ||
                                        "Not Specified"}
                                </p>

                                <h3>Medicines</h3>

                                {prescription.medicines?.length > 0 ? (
                                    <ol>
                                        {prescription.medicines.map(
                                            (medicine, index) => (
                                                <li key={index}>
                                                    {typeof medicine ===
                                                    "string"
                                                        ? medicine
                                                        : medicine.name ||
                                                          "Medicine"}
                                                </li>
                                            )
                                        )}
                                    </ol>
                                ) : (
                                    <p>
                                        No medicines prescribed
                                    </p>
                                )}

                                <h3>Tests</h3>

                                <p>
                                    {prescription.tests ||
                                        "No tests advised"}
                                </p>

                                <h3>Advice</h3>

                                <p>
                                    {prescription.advice ||
                                        "No additional advice"}
                                </p>

                                <h3>Follow-up Date</h3>

                                <p>
                                    {prescription.followUpDate
                                        ? new Date(
                                              prescription.followUpDate
                                          ).toLocaleDateString()
                                        : "Not specified"}
                                </p>

                            </div>

                            {/* Footer */}
                            <div className="prescription-footer">

                                <div>
                                    <p>
                                        📅 Issued on:{" "}
                                        {new Date(
                                            prescription.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="doctor-signature">

                                    <p>
                                        ________________________
                                    </p>

                                    <strong>
                                        {prescription.doctorId?.userId
                                            ?.username || "Doctor"}
                                    </strong>

                                    <p>Doctor</p>

                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="prescription-actions">

                                <button
                                    onClick={() => window.print()}
                                >
                                    👁️ View / Print
                                </button>

                               <button
    onClick={async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/prescriptions/${prescription._id}/pdf`,
                {
                    method: "GET",
                    headers: {
                        Authorization: authorizationToken,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.msg || errorData.message || "Unable to download PDF");
                return;
            }

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `Prescription-${prescription._id}.pdf`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.log("PDF download error:", error);
            alert("Unable to download prescription PDF");
        }
    }}
>
    📄 Download PDF
</button>
                            </div>

                        </div>

                    ))}

                </div>
            )}
        </div>
    );
};

export default PatientPrescription;