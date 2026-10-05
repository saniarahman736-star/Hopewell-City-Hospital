import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../store/auth";
export const ViewAppointment=() =>{
    const {authorizationToken}=useAuth();
    const[appointment,setAppointment]=useState({
        doctorId:"",
        appointmentDate:"",
        appointmentTime:"",
        reason:"",
        status:"",
    });
    const navigate=useNavigate();
    const getAppointmentProfile=async()=>{
        try{
          const response=await fetch(`http://localhost:5000/api/appointments/appointment`,{
            method:"GET",
            headers:{
                Authorization:authorizationToken,
            }
          });
          console.log("Status:",response.status);
          const res_data=await response.json();
          if(response.ok){
            setAppointment(res_data.data[0]);
            
          }
        }catch(error){
            console.log(error);
        }
    };
        useEffect(()=>{
            if(authorizationToken){
                getAppointmentProfile();
            }
        },[authorizationToken]);
    return (
        <>
        <div className="appointment-section">
            <div className="grid grid-two-cols">
                <div className="appointment-img">
                    <img src="/images/doctorpic21.jpg"
                    alt="an appointment picture"
                    ></img>
                </div>
        <div className="appointment-info">
            <h1>My Appointment</h1>
            <div className="appointment-details">
                  <h2>Appointment Details</h2>
                <p><strong>Appointment Date:</strong>{appointment.appointmentDate}</p>
                <p><strong>Appointment Time:</strong>{appointment.appointmentTime}</p>
                <p><strong>Status:</strong>
                <span className={`status ${appointment.status?.toLowerCase()}`}>
                    {appointment.status}
                </span>
                </p>
            </div>
            <div className="doctor-details">
                <h2>Doctor's Details</h2>
                <p><strong>Name Of Doctor:</strong>{appointment.doctorId?.userId?.username}</p>
                <p><strong>Specialization:</strong>{appointment.doctorId?.specialization}</p>
                <p><strong>Consultation Fee:</strong>{appointment.doctorId?.consultationFee}</p>
            </div>
            </div>
        </div>
          <div className="appointment-actions">
         <button
         className="dashboard-btn"
         onClick={() => navigate("/patient/dashboard")}
         >
        🏠 Back to Dashboard
        </button>
        </div>
        </div>
        
    <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
     </footer>
     </>
    )
}
export default ViewAppointment;