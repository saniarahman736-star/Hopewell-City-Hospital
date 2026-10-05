import {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import {toast} from "react-toastify";
import "./DoctorPrescription.css";
const DoctorPrescription=()=>{
    const navigate=useNavigate();
    const {authorizationToken}=useAuth();
    const [doctor,setDoctor]=useState(null);
    const [appointments,setAppointments]=useState(null);
    const [selectedAppointment,setSelectedAppointment]=useState(null);
    const [loadingAppointments,setLoadingAppointments]=useState(true);
    const [prescription,setPrescription]=useState({
       appointmentId:"",
       patientName:"",
       patientAge:"",
       patientGender:"",
       diagnosis:"",
       tests:"",
       advice:"",
       followUpDate:"",
    }
    );
    const [medicines,setMedicines]=useState([
       {
        name:"",
        dosage:"",
        frequency:"",
        duration:"",
        instructions:"",
        timings:[]
       }
    ]);
    useEffect(()=>{
        const fetchDoctorProfile=async()=>{
            try{
             const response=await fetch (
                "http://localhost:5000/api/doctor/my-profile",
                {
                    headers:{
                        Authorization:authorizationToken,
                    },
                }
             );
             const data=await response.json();
             if(response.ok){
                setDoctor(data.data);
             }
            }catch(error){
             console.log("Doctor profile error:",error);
            }
            const appointmentResponse=await fetch(
                "http://localhost:5000/api/appointments/doctor-appointments",
                {
                    headers:{
                        Authorization:authorizationToken
                    }
                }
            );
            const appointmentData=await appointmentResponse.json();
            if(appointmentResponse.ok){
                setAppointments(appointmentData.data || []);
            } else {
                setAppointments([]);
            }
            setLoadingAppointments(false);
        };
        if(authorizationToken){
            fetchDoctorProfile();
        }
    },[authorizationToken]);
    const handleAppointmentSelect=(e)=>{
        const appointmentId=e.target.value;
        if(!appointmentId){
            setSelectedAppointment(null);
            setPrescription((previous)=>({
                ...previous,
                appointmentId:"",
                patientName:"",
            }));
            return;
        }
        const appointment=appointments.find(
            (item)=>item._id===appointmentId
        );
        if(!appointment){
            return;
        }
        setSelectedAppointment(appointment);
        setPrescription((previous)=>({
            ...previous,
            appointmentId:appointment._id,
            patientName:appointment.patientId?.username || "",
        }));
    }
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setPrescription((previous)=>({
            ...previous,
            [name]:value,
        }));
    };
    const handleMedicineChange=(index,field,value)=>{
        setMedicines((previous)=>
            previous.map((medicine,medicineIndex)=>
            medicineIndex === index
             ? {
                ...medicine,
                [field]:value,
             }
            : medicine
        )
        );
    };
    const addMedicine=()=>{
        setMedicines((previous)=>[
            ...previous,
            {
                name:"",
                dosage:"",
                frequency:"",
                duration:"",
                instructions:"",
                timings:[]
            },
        ]);
    };
    const removeMedicine=(index)=>{
        if(medicines.length === 1){
            return;
        }
    setMedicines((previous)=>
      previous.filter(
        (_,medicineIndex)=>medicineIndex !== index
      ))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!prescription.appointmentId){
            alert("Please select a patient appointment first");
            return;
        }
        try{
            const response=await fetch(
                "http://localhost:5000/api/prescriptions",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:authorizationToken,
                    },
                    body:JSON.stringify({
                        appointmentId:prescription.appointmentId,
                        diagnosis:prescription.diagnosis,medicines,
                        tests:prescription.tests,
                        advice:prescription.advice,
                        followUpDate:prescription.followUpDate
                    }),
                }
            );
            const data=await response.json();
            if(response.ok){
                toast.success("Prescription saved successfully");
            } else {
                toast.error(
                    data.msg || "Failed to save prescription"
                )
            }
        }catch(error){
            console.log("Prescription save error:",error);
            toast.error("Something went wrong while saving prescription")
        }
    };
    return (
        <div className="prescription-page">
            <div className="prescription-paper">
                <header className="prescription-header">
                    <div className="hospital-logo">
                         🏥
                    </div>
                    <div className="hospital-details">
                        <h1>HOPEWELL CITY HOSPITAL</h1>
                       <p>
                       Kolkata, West Bengal, India
                       </p>
                      <div className="hospital-contact">
              <span>📞 +91 9876543210</span>
              <span>✉ support@hopewehospital.com</span>
            </div>

              <p className="working-hours">
              Monday - Saturday | 9:00 AM - 8:00 PM
               </p> 
              </div>
            </header>
            <div className="header-line">
                <section className="doctor-information">
                    <div>
                        <h2>{doctor?.userId?.username || "Doctor Name"}</h2>
                        <p>{doctor?.qualification || "Qualification"}</p>
                        <p>{doctor?.specialization || "Specialization"}</p>
                    </div>
                    <div className="doctor-contact">
                        <p>📞 {doctor?.userId?.phone || "Phone"}</p>
                        <p>✉ {doctor?.userId?.email || "Email"}</p>
                        <p>💼 {doctor?.experience || 0} years experience</p>
                    </div>
                </section>
                <div className="doctor-line"></div>
                <div className="prescription-title">
                    <h2>PRESCRIPTION</h2>
                    <p>Medical Prescription</p>
                </div>
                <form onSubmit={handleSubmit}>
                  <section className="appointment-selection">
                    <h3>Select Patient Appointment</h3>
                    {loadingAppointments ? (
                        <p>Loading appointments...</p>
                    ):appointments.length === 0 ?
                (<p>No appointments found</p>
                ):(
                    <select 
                    value={prescription.appointmentId}
                        onChange={handleAppointmentSelect}
                        required
                        >
                            <option value="">
                                Select An Appointment
                            </option>
                    {appointments.map((appointment)=>(
                        <option key={appointment._id}
                        value={appointment._id}
                        >
                            {appointment.patientId?.username || "Unknown Patient"}
                            {" - "}
                            {appointment.appointmentDate}
                            {" - "}
                    {Array.isArray(appointment.appointmentTime)?
                    appointment.appointmentTime.join(" - "):
                appointment.appointmentTime}
                        </option>
                    ))}
                    </select>
                )}
                  </section>
                    <section className="patient-section">
                        <div className="section-heading">
                            <h3>Patient Information</h3>
                        </div>
                        <div className="patient-grid">
                            <div className="form-group">
                                <label>Patient Name</label>
                                <input
                                  type="text"
                                  value={prescription.patientName}
                                  placeholder="Enter patient name"
                                  readOnly
                                  />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                  type="number"
                                  name="patientAge"
                                  value={prescription.patientAge}
                                  onChange={handleChange}
                                  placeholder="Enter patient age"
                                  />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                  name="patientGender"
                                  value={prescription.patientGender}
                                  onChange={handleChange}
                                  >
                                  <option value="">Select Gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                  </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                  type="date"
                                  value={new Date()
                                    .toISOString()
                                    .split("T")[0]}
                                    readOnly
                                  />
                            </div>
                        </div>
                    </section>
                    <section className="prescription-section">
                        <h3>Diagnosis</h3>
                        <textarea
                          name="diagnosis"
                          value={prescription.diagnosis} 
                          onChange={handleChange}
                          placeholder="Enter diagnosis..."
                          rows="3"
                          />
                    </section>
                    <section className="prescription-section">
                        <div className="medicine-heading">
                            <div>
                                <h3>Rx</h3>
                                <p>Prescribed Medicines</p>
                            </div>
                            <span className="rx-symbol">Rx</span>
                            </div>
                            {medicines.map((medicine,index)=>(
                                <div className="medicine-card"
                                 key={index}
                                >
                                    <div className="medicine-number">
                                        {index+1}
                                </div>
                                <div className="medical-fields">
                                    <div className="form-group medicine-name">
                                 <label>Medicine Name</label>
                                 <input
                                   type="text"
                                   value={medicine.name}
                                   onChange={(e)=>
                                    handleMedicineChange(
                                        index,
                                        "name",
                                        e.target.value
                                    )
                                   }
                                   placeholder="Medicine name"
                                   />
                                    </div>
                                    <div className="form-group">
                                        <label>Dosage</label>
                                        <input
                                          type="text"
                                          value={medicine.dosage}
                                          onChange={(e)=>
                                            handleMedicineChange(
                                                index,
                                                "dosage",
                                                e.target.value
                                            )
                                          }
                                       placeholder="e.g. 500mg"
                                       />
                                    </div>
                                    <div className="form-group">
                                        <label>Frequency</label>
                                        <input
                                          type="text"
                                          value={medicine.frequency}
                                          onChange={(e)=>
                                            handleMedicineChange(
                                                index,
                                                "frequency",
                                                e.target.value
                                            )
                                          }
                                          placeholder="e.g. 2 times/day"
                                          />
                                    </div>
                                    <div className="form-group">
    <label>Medicine Timings</label>
    <input
        type="text"
        value={medicine.timings.join(", ")}
        onChange={(e) =>
            handleMedicineChange(
                index,
                "timings",
                e.target.value
                    .split(",")
                    .map((time) => time.trim())
                    .filter(Boolean)
            )
        }
        placeholder="e.g. 09:00 AM, 09:00 PM"
    />
</div>
                                     <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                          type="text"
                                          value={medicine.duration}
                                          onChange={(e)=>
                                            handleMedicineChange(
                                                index,
                                                "duration",
                                                e.target.value
                                            )
                                          }
                                          placeholder="e.g. 5 days"
                                          />
                                    </div>
                                     <div className="form-group full-width">
                                        <label>Instructions</label>
                                        <input
                                          type="text"
                                          value={medicine.instructions}
                                          onChange={(e)=>
                                            handleMedicineChange(
                                                index,
                                                "instructions",
                                                e.target.value
                                            )
                                          }
                                          placeholder="e.g. Take after food"
                                          />
                                    </div>
                                </div>
                                {medicines.length>1 && (
                                    <button 
                                     type="button"
                                     className="remove-medicine"
                                     onClick={()=>removeMedicine(index)}>
                                        ❌
                                     </button>
                                     )}
                                     </div>
                            ))}
                            <button 
                              type="button"
                              className="add-medicine"
                              onClick={addMedicine}
                              >
                                +Add Medicine
                              </button>
                    </section>
                    <section className="prescription-section">
                        <h3>Tests/Investigations</h3>
                        <textarea
                         name="tests"
                         value={prescription.tests}
                        onChange={handleChange}
                         placeholder="Enter recommended tests or investigations..."
                         rows="3"
                         />
                    </section>
                     <section className="prescription-section">
                        <h3>Advice/Instructions</h3>
                        <textarea
                         name="advice"
                         value={prescription.advice}
                         onChange={(e) =>
      setPrescription((previous) => ({
        ...previous,
        advice: e.target.value,
      }))
    }
                         placeholder="Enter advice and instructions for the patient..."
                         rows="4"
                         />
                    </section>
                    <section className="follow-up-section">
                        <div className="form-group">
                            <label>Follow-up Date</label>
                            <input
                              type="date"
                              name="followUpDate"
                              value={prescription.followUpDate}
                              onChange={handleChange}
                             />
                        </div>
                    </section>
                    <section className="signature-section">
                        <div className="signature-space">
                                <div className="signature-line"></div>
                                    <strong>{doctor?.userId?.username || "Doctor Name"}</strong>
                                    <span>{doctor?.qualification || ""}</span>
                                    <span>{doctor?.specialization || ""}</span>
                        </div>
                    </section>
                    <footer className="prescription-footer">
                        <p>HopeWell City Hospital</p>
                        <span>This prescription is digitally generated for the named patient </span>
                    </footer>
                    <div className="prescription-actions">
                        <button type="submit"
                        className="save-prescription">💾 Save Prescription</button>
                        <button type="button"
    className="back-dashboard-btn"
    onClick={() => navigate("/doctor-dashboard")}
>
    ← Back to Dashboard
</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}
export default DoctorPrescription;