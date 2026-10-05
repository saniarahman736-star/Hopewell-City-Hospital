import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import "./DoctorDashboard.css";

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { authorizationToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchDashboardData = useCallback(async () => {
    try {
      const [profileResponse, appointmentResponse] = await Promise.all([
        fetch("http://localhost:5000/api/doctor/my-profile", {
          headers: {
            Authorization: authorizationToken,
          },
        }),

        fetch(
          "http://localhost:5000/api/appointments/doctor-appointments",
          {
            headers: {
              Authorization: authorizationToken,
            },
          }
        ),
      ]);

      const profileData = await profileResponse.json();
      const appointmentData = await appointmentResponse.json();

      console.log("Doctor profile:", profileData);
      console.log("Doctor appointments:", appointmentData);

      if (profileResponse.ok) {
        setDoctor(profileData.data);
      }

      if (appointmentResponse.ok) {
        setAppointments(appointmentData.data || []);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }, [authorizationToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // LOCAL DATE
  const now = new Date();

  const today = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  console.log("Today's date:", today);
  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.appointmentDate === today &&
      appointment.status !== "Cancelled"
  );
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "Pending"
  );
  const uniquePatients = [
    ...new Map(
      appointments
        .filter((appointment) => appointment.patientId)
        .map((appointment) => [
          appointment.patientId?._id,
          appointment.patientId,
        ])
    ).values(),
  ];
   const upcomingAppointments = appointments
  .filter((appointment) => {
    const appointmentDate = new Date(
      appointment.appointmentDate
    );

    const todayDate = new Date();

    todayDate.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);

    return (
      appointmentDate > todayDate &&
      appointment.status !== "Cancelled"
    );
  })
  .sort(
    (a, b) =>
      new Date(a.appointmentDate) -
      new Date(b.appointmentDate)
  );
  // COMPLETED APPOINTMENTS
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  );

  // CONSULTATION EARNINGS
  const consultationFee = Number(
    doctor?.consultationFee || 0
  );

  const consultationEarnings =
    completedAppointments.length * consultationFee;

  // UPDATE STATUS
  const updateStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      console.log("Status update:", data);

      if (response.ok) {
        setAppointments((previousAppointments) =>
          previousAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? {
                  ...appointment,
                  status: status,
                }
              : appointment
          )
        );
      } else {
        console.log("Status update failed:", data);
      }
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="doctor-dashboard">

      {/* NAVBAR */}
      <header className="doctor-navbar">

        <div className="doctor-logo">
          🩺 <span>HopeWell Hospital</span>
        </div>

        <nav>

          <button
            onClick={() => navigate("/doctor-dashboard")}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => navigate("/doctor/appointments")}
          >
            📅 Appointments
          </button>

          <button
            onClick={() => navigate("/doctor/prescriptions")}
          >
             🗒️ Prescriptions
          </button>
          <button
          onClick={() => navigate("/doctor/record-vital")}
           >
             ❤️ Record Vital
          </button>
          <button
            onClick={() => navigate("/doctor-profile")}
          >
            👤 Profile
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            🚪
          </button>

        </nav>

      </header>


      {/* WELCOME */}
      <section className="doctor-welcome">

        <div>

          <h1>
            👋 Welcome,{" "}
            {doctor?.userId?.username || "Doctor"}
          </h1>

          <p>
            Here is your practice overview for today
          </p>

        </div>

        <div className="welcome-icon">
          🩺
        </div>

      </section>


      {/* STATISTICS */}
      <section className="stats-grid">

        {/* TODAY */}
        <div className="stats-card">

          <div className="stat-icon">
            📅
          </div>

          <div>

            <h3>
              Appointments For Today
            </h3>

            <h2>
              {todayAppointments.length}
            </h2>

          </div>

        </div>


        {/* PATIENTS */}
        <div className="stats-card">

          <div className="stat-icon">
            🧑‍🤝‍🧑
          </div>

          <div>

            <h3>
              Total Patients
            </h3>

            <h2>
              {uniquePatients.length}
            </h2>

          </div>

        </div>


        {/* PENDING */}
        <div className="stats-card">

          <div className="stat-icon">
            ⏳
          </div>

          <div>

            <h3>
              Pending Appointments
            </h3>

            <h2>
              {pendingAppointments.length}
            </h2>

          </div>

        </div>


        {/* EARNINGS */}
        <div className="stats-card">

          <div className="stat-icon">
            💰
          </div>

          <div>

            <h3>
              Consultation Earnings
            </h3>

            <h2>
              ₹{consultationEarnings}
            </h2>

          </div>

        </div>

      </section>


      {/* TODAY'S APPOINTMENTS */}
      <section className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Appointment For Today
            </h2>

            <p>
              Your appointments scheduled for today
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/doctor/appointments")
            }
          >
            View All ➡️
          </button>

        </div>


        {todayAppointments.length === 0 ? (

          <div className="empty-state">

            <span>
              📅
            </span>

            <h3>
              No appointments
            </h3>

            <p>
              You do not have any appointments
              scheduled for today
            </p>

          </div>

        ) : (

          <div className="appointment-table">

            <div className="table-header">

              <span>
                Patient
              </span>

              <span>
                Date
              </span>

              <span>
                Time
              </span>

              <span>
                Status
              </span>

              <span>
                Action
              </span>

            </div>


            {todayAppointments.map(
              (appointment) => (

                <div
                  className="table-row"
                  key={appointment._id}
                >

                  {/* PATIENT */}
                  <span className="patient-name">

                    🧑{" "}

                    <strong>
                      {appointment.patientId?.username ||
                        "Unknown Patient"}
                    </strong>

                  </span>


                  {/* DATE */}
                  <span>
                    {appointment.appointmentDate}
                  </span>


                  {/* TIME */}
                  <span>

                    {Array.isArray(
                      appointment.appointmentTime
                    )
                      ? appointment.appointmentTime.join(
                          " - "
                        )
                      : appointment.appointmentTime}

                  </span>


                  {/* STATUS */}
                  <span>

                    {appointment.status ===
                    "Pending" ? (

                      <button
                        type="button"
                        className="status-pending pending-clickable"
                        onClick={() =>
                          updateStatus(
                            appointment._id,
                            "Completed"
                          )
                        }
                      >
                        Pending
                      </button>

                    ) : appointment.status ===
                      "Completed" ? (

                      <b className="status-confirmed">
                        ✔️ Completed
                      </b>

                    ) : (

                      <b className="status-other">
                        {appointment.status}
                      </b>

                    )}

                  </span>


                  {/* ACTION */}
                  <span className="action-buttons">

                    {appointment.status ===
                      "Pending" && (

                      <span className="complete-hint">
                        Click Pending to complete
                      </span>

                    )}

                    {appointment.status ===
                      "Completed" && (

                      <span className="completed-text">
                        🎉 Checkup Done
                      </span>

                    )}

                  </span>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* UPCOMING APPOINTMENTS */}
      <section className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              📅 Upcoming Appointments
            </h2>

            <p>
              Your next scheduled consultations
            </p>

          </div>

        </div>


        {upcomingAppointments.length === 0 ? (

          <div className="empty-state">

            <span>
              📅
            </span>

            <h3>
              No upcoming appointments
            </h3>

          </div>

        ) : (

          <div className="upcoming-grid">

            {upcomingAppointments
              .slice(0, 5)
              .map((appointment) => (

                <div
                  className="upcoming-card"
                  key={appointment._id}
                >

                  <div className="upcoming-top">

                    <div className="patient-avatar">
                      👤
                    </div>

                    <div>

                      <h3>
                        {appointment.patientId?.username ||
                          "Unknown Patient"}
                      </h3>

                      <p>
                        📅{" "}
                        {appointment.appointmentDate}
                      </p>

                      <p>

                        ⏰{" "}

                        {Array.isArray(
                          appointment.appointmentTime
                        )
                          ? appointment.appointmentTime.join(
                              " - "
                            )
                          : appointment.appointmentTime}

                      </p>

                    </div>

                    <span
                      className={
                        appointment.status ===
                        "Completed"
                          ? "status-confirmed"
                          : "status-pending"
                      }
                    >
                      {appointment.status}
                    </span>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>
    </div>
  );
};

export default DoctorDashboard;