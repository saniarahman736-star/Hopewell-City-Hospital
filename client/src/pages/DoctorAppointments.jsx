import {useState,useEffect} from "react";
import {useAuth} from "../store/auth";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "./DoctorAppointment.css";
export const DoctorAppointments=()=>{
    const navigate=useNavigate();
    const {authorizationToken}=useAuth();
    const [appointments,setAppointments]=useState([]);
    const [loading,setLoading]=useState(true);
    const getAppointments=async()=>{
        try{
           const response=await fetch(
            "http://localhost:5000/api/appointments/doctor-appointments",
            {
                method:"GET",
                headers:{
                    Authorization:authorizationToken,
                },
            }
           );
           const data=await response.json();
           if(response.ok){
          const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredAppointments = (data.data || []).filter(
        (appointment) => {
            const appointmentDate = new Date(
                appointment.appointmentDate
            );

            appointmentDate.setHours(0, 0, 0, 0);

            return appointmentDate.getTime() === today.getTime();
        }
    );

    setAppointments(filteredAppointments);
}
        }catch(error){
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };
    useEffect(()=>{
        getAppointments();
    },[]);
    if(loading){
        return <h2>Loading Appointments...</h2>;
    }
    return(
        <div className="doctor-appointments-page">
            <h1>📅My Appointments</h1>
            <p>View Appointments booked by your patients</p>
            {appointments.length === 0 ? (
                <div>
                 <h3>No appointments found</h3>
                    </div>   
                ):(
                  <div className="appointments-list">
                    {appointments.map((appointment)=>(
                        <div className="appointment-card"
                        key={appointment._id}
                        >
                    <h2>🧑 <strong>{appointment.patientId?.username || "Unknown Patient"}</strong></h2>
                    <p>📧<strong>Email:</strong>
                    {appointment.patientId?.email}
                    </p>
                    <p>📱<strong>Phone:</strong>
                    {appointment.patientId?.phone}
                    </p>
                    <p>📅<strong>Date:</strong>
                    {appointment.appointmentDate}
                    </p>
                    <p>🕒<strong>Time:</strong>{" "}
                    {Array.isArray(appointment.appointmentTime)?
                    appointment.appointmentTime.join(" - "):
                    appointment.appointmentTime}
                    </p>
                    <p>📝<strong>Reason:</strong>
                    {appointment.reason}
                    </p>
                    <p>📌<strong>Status:</strong>
                    {appointment.status}
                    </p>
                    <button className="view-details-btn"
                    onClick={()=>navigate(`/doctor/patient/${appointment.patientId._id}`)}>
                       👁️ View Details
                    </button>
                        </div>
                    ))}
                    </div>
                )}
        </div>
    )
}
export default DoctorAppointments;