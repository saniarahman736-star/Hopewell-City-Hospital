import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../store/auth";
import "./PatientDashboard.css";
export const PatientDashboard=()=>{
    const {user,authorizationToken}=useAuth();
    const navigate=useNavigate();
    const [appointments,setAppointments]=useState([]);
    const [loadingAppointments,setLoadingAppointments]=useState(true);
    const [prescriptions,setPrescriptions]=useState([]);
    const [loadingPrescriptions,setLoadingPrescriptions]=useState(true);
    const [vitals,setVitals]=useState(null);
    const [loadingVitals,setLoadingVitals]=useState(true);
    useEffect(()=>{
        const getAppointments=async()=>{
            try{
             const response=await fetch(
                "http://localhost:5000/api/appointments/appointment",
                {
                    method:"GET",
                    headers:{
                        Authorization:authorizationToken
                    },
                }
             );
             const data=await response.json();
             if(response.ok){
                setAppointments(data.data || []);
             } else {
                setAppointments([]);
             }
            }catch(error){
               console.log(error);
               setAppointments([]);
            } finally {
                setLoadingAppointments(false);
            }
        };
        if(authorizationToken){
            getAppointments();
        }
    },[authorizationToken]);
    useEffect(()=>{
        const getPrescriptions=async()=>{
            try{
              const response=await fetch(
                "http://localhost:5000/api/prescriptions/my",{
                    method:"GET",
                    headers:{
                        Authorization:authorizationToken
                    }
                }
              );
              const data=await response.json();
              if(response.ok){
                setPrescriptions(data.data || []);
              } else {
                setPrescriptions([]);
              }
            }catch(error){
                console.log(error);
                setPrescriptions([]);
            } finally {
                setLoadingPrescriptions(false);
            }
        };
        if(authorizationToken){
            getPrescriptions();
        }
    },[authorizationToken]);
    useEffect(()=>{
    const getVitals=async()=>{
        try{
            const response=await fetch(
                "http://localhost:5000/api/vitals/my",
                {
                    method:"GET",
                    headers:{
                        Authorization:authorizationToken
                    }
                }
            );

            const data=await response.json();

            if(response.ok){
                setVitals(data.data?.[0] || null);
            } else {
                setVitals(null);
            }
        }catch(error){
            console.log("Vitals error:",error);
            setVitals(null);
        }finally{
            setLoadingVitals(false);
        }
    };

    if(authorizationToken){
        getVitals();
    }
},[authorizationToken]);
    const totalMedicines=prescriptions.reduce(
        (total,prescription)=>
            total+(prescription.medicines?.length || 0),0
    );
    return (
        <>
         <div className="patient-dashboard">
            <nav className="patient-navbar">
                <div className="patient-logo">
                     🏥 HopeWell City Hospital
                </div>
                <div className="patient-nav-links">
                    <button onClick={()=>navigate("/patient/profile")}>
                       🧑 My Profile
                    </button>
                    <button onClick={()=>navigate("/appointment")}>
                       📅 Appointments
                    </button>
                     <button onClick={()=>navigate("/medications")}>
                       💊 Medications
                    </button>
                     <button onClick={()=>navigate("/blood-bank")}>
                       🩸 Blood Bank
                    </button>
                     <button onClick={()=>navigate("/logout")}>
                       🚪 Logout
                    </button>
                </div>
            </nav>
            <section className="patient-welcome">
                <div>
                    <h1>Welcome,{user?.username || "Patient"}👋</h1>
                    <p>Here is your personalized health overview and recent activities</p>
                </div>
            </section>
            <section className="patient-statistics">
                <div className="stat-card">
                    <span>📅</span>
                    <div>
                        <h3>Appointments</h3>
                        <strong>{appointments.length}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <span>🩺</span>
                    <div>
                        <h3>Health Records</h3>
                        <strong>--</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <span>💊</span>
                    <div>
                        <h3>Medications</h3>
                        <strong>{totalMedicines}</strong>
                    </div>
                </div>
                <div className="stat-card">
                    <span>🗒️</span>
                    <div>
                        <h3>Prescriptions</h3>
                        <strong>{prescriptions.length}</strong>
                    </div>
                </div>
            </section>
            <section className="patient-dashboard-grid">
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <h2>❤️ Vital Health Metrics</h2>
                    </div>
                    {loadingVitals ? (
                        <div className="empty-panel">
            <span>❤️</span>
            <h3>Loading vital health metrics...</h3>
        </div>
    ) : !vitals ? (
        <div className="empty-panel">
            <span>❤️</span>
            <h3>No vital records available</h3>
            <p>
                Your doctor has not recorded your vital health metrics yet.
            </p>
        </div>
    ) : (
                    <div className="vitals-grid">
                        <div className="vital-item">
                            <span>❤️</span>
                            <div>
                                <p>Heart Rate</p>
                                <strong>{vitals.heartRate ?? "---"}  BPM</strong>
                            </div>
                        </div>
                        <div className="vital-item">
                            <span>🩸</span>
                            <div>
                                <p>Blood Pressure</p>
                                <strong>
                                    {vitals.systolicBP ?? "---"}/
                                    {vitals.diastolicBP ?? "---"} mmHg
                                </strong>
                            </div>
                        </div>
                        <div className="vital-item">
                            <span>🌡️</span>
                            <div>
                                <p>Temperature</p>
                                <strong>{vitals.temperature ?? "---"}°F</strong>
                            </div>
                        </div>
                        <div className="vital-item">
                            <span>🫁</span>
                            <div>
                                <p>Oxygen Level</p>
                                <strong> {vitals.oxygenLevel ?? "---"} %</strong>
                            </div>
                        </div>
                        <div className="vital-item">
                <span>🫁</span>
                <div>
                    <p>Respiratory Rate</p>
                    <strong>
                        {vitals.respiratoryRate ?? "---"} /min
                    </strong>
                </div>
            </div>
                 <div className="vital-item">
                <span>⚖️</span>
                <div>
                    <p>Weight</p>
                    <strong>
                        {vitals.weight ?? "---"} kg
                    </strong>
                </div>
            </div>
        </div>
    )}
                </div>
                <div className="dashboard-panel">
                    <div className="panel-header">
                        <h2>📅Book Appointment</h2>
                        <button onClick={()=>navigate("/appointment")}>
                            Click Here To Book ➡️
                        </button>
                    </div>
                    {loadingAppointments ? (
                        <div className="appointment-preview">
                            <div className="appointment-info">
                                <h3>Loading appointment...</h3>
                                </div>
                            </div>
                    ): appointments.length === 0 ? (
                <div className="appointment-preview">
                    <div className="doctor-avatar">
                        📅
                        </div>
                    <div className="appointment-info">
                        <h3>No recent appointment</h3>
                        <p>Book an appointment with a doctor</p>
                    </div>
                </div>
                    ):(
                        (()=>{
                            const latestAppointment=
                            [...appointments].sort(
                                (a,b)=>
                                    new Date(b.appointmentDate)-
                                    new Date(a.appointmentDate)
                            )[0];
                            return (
                                <div className="appointment-preview">
                                    <div className="doctor-avatar">
                        👩‍⚕️
                    </div>
                    <div className="appointment-info">
                        <h3>{" "}{latestAppointment.doctorId?.userId?.username || "Doctor"}</h3>
                         <p>
                        📅 {latestAppointment.appointmentDate}
                    </p>

                    <p>
                        🕒{" "}
                        {Array.isArray(
                            latestAppointment.appointmentTime
                        )
                            ? latestAppointment.appointmentTime.join(" - ")
                            : latestAppointment.appointmentTime}
                    </p>

                    <span
                        className={`appointment-status ${latestAppointment.status?.toLowerCase()}`}
                    >
                        {latestAppointment.status}
                    </span>
                        </div>
                    </div>
                            );
                        }) ()
                    )}
                </div>
                <div className="dashboard-panel">
    <div className="panel-header">
        <h2>🗒️ My Prescription</h2>
        <button onClick={() => navigate("/patient/prescriptions")}>
            View All➡️
        </button>
    </div>

    {loadingPrescriptions ? (
        <div className="empty-panel">
            <span>🗒️</span>
            <h3>Loading Prescriptions...</h3>
        </div>
    ) : prescriptions.length === 0 ? (
        <div className="empty-panel">
            <span>🗒️</span>
            <h3>No prescriptions available</h3>
            <p>
                Your prescriptions will appear here after your doctor creates one.
            </p>
        </div>
    ) : (
        (() => {
            const latestPrescription = prescriptions[0];

            return (
                <div className="prescription-preview">
                    <div className="prescription-icon">
                        🗒️
                    </div>

                    <div className="prescription-info">
                        <h3>
                            {latestPrescription.doctorId?.userId?.username || "Doctor"}
                        </h3>

                        <p>
                            🩺 Diagnosis:{" "}
                            {latestPrescription.diagnosis || "Not specified"}
                        </p>

                        <p>
                            🧪 Tests:{" "}
                            {latestPrescription.tests || "None"}
                        </p>

                        <p>
                            📅 Follow-up:{" "}
                            {latestPrescription.followUpDate
                                ? new Date(
                                      latestPrescription.followUpDate
                                  ).toLocaleDateString()
                                : "Not specified"}
                        </p>

                        <p>
                            💊 {latestPrescription.medicines?.length || 0} medicine(s)
                        </p>
                    </div>
                </div>
            );
        })()
    )}
</div>
                    
                    
                <div className="dashboard-panel emergency-panel">
                  <div className="panel-header">
                    <h2>🚨Emergency Admission</h2>
                  </div>
                  <div className="emergency-content">
                    <div className="emergency-icon">
                         🚑
                    </div>
                    <div>
                        <h3>Need immediate medical attention</h3>
                        <p>Request emergency admission and contact the hospital</p>
                        <button
                         onClick={()=>
                            navigate("/emergency-admission")}>
                              Emergency Admission
                      </button>
                    </div>
                  </div>
                </div>
            </section>
            <section className="dashoard-panel reminder-panel">
                <div className="panel-header">
                    <h2>🔔 Smart Reminders</h2>
                    <span className="notification-badge">0</span>
                </div>
                <div className="reminders-list">
                    <div className="reminder-item">
                        <div className="reminder-icon">📅</div>
                        <div>
                            <h3>Appointment Reminder</h3>
                            <p>Your upcoming appointment reminders will appear here</p>
                        </div>
                    </div>
                    <div className="reminder-item">
                        <div className="reminder-icon">💊</div>
                        <div>
                            <h3>Medications Reminder</h3>
                            <p>Your medication reminders will appear here</p>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="patient-footer">
                <p>
                    © 2026 HopeWell City Hospital. All Rights Reserved.
                </p>
            </footer>
         </div>
     </>
    )
}
export default PatientDashboard;
