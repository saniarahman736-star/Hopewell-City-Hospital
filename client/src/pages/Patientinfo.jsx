import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../store/auth";

export const PatientInfo=() =>{
    const {user,authorizationToken}=useAuth();
    const[patient,setPatient]=useState({
        age:"",
        gender:"",
        bloodGroup:"",
        address:"",
        emergencyContact:"",
        allergies:[],
        medicalHistory:[],   
    });
    const navigate=useNavigate();
    const getPatientProfile=async()=>{
       try{
         const response=await fetch(`http://localhost:5000/api/patients/profile`,{
            method:"GET",
            headers:{
                Authorization:authorizationToken,
            }
         });
         console.log("Status:", response.status);
         const res_data=await response.json();
         if(response.ok){
            setPatient(res_data.data);
         }
       }catch(error){
          console.log(error);
       }
    };
        useEffect(()=>{
            if(authorizationToken){
            getPatientProfile();
            }
        },[authorizationToken]);
    return (
        
        <>
        <div className="patient-info">
            <h1>Patient Information</h1>
            <div className="personal-info">
                <h2> 👤 Personal Details</h2>
                <p><strong>Name:</strong> {user?.username}</p>
                <p><strong>Age:</strong>{patient.age}</p>
                <p><strong>Gender:</strong>{patient.gender}</p>
            </div>
            <div className="contact-info">
                <h2> 📞 Contact Details</h2>
                <p><strong>EmergencyContact:</strong> {patient.emergencyContact}</p>
                <p><strong>Email:</strong>{user?.email}</p>
                <p><strong>Address:</strong>{patient.address}</p>
            </div>
            <div className="medical-info">
                <h2> 🏥 Medical Details</h2>
                <p><strong>BloodGroup:</strong> {patient.bloodGroup}</p>
                <p><strong>Allergies:</strong></p>
                <ul>
                {patient.allergies.map((item, index) => (
                <li key={index}>{item}</li>
                ))}
                </ul>
                <p><strong>Medical History:</strong></p>
                <ul>
                {patient.medicalHistory.map((item,index)=>(
                <li key={index}>{item}</li>
                ))}
                </ul>
            </div>
            <div className="patient-actions">
    <button
        className="dashboard-btn"
        onClick={() => navigate("/patient/dashboard")}
    >
        🏠 Back to Dashboard
    </button>

    <button
        className="edit-btn"
        onClick={() => navigate("/patient/edit")}
    >
        ✏️ Edit Profile
    </button>
</div>

        </div>
    <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
     </footer>
     </>
    )
}
export default PatientInfo;