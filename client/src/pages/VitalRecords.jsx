import {useEffect,useState} from "react";
import {useAuth} from "../store/auth";
import {toast} from "react-toastify";
import "./VitalRecord.css";
const VitalRecords=()=>{
    const {authorizationToken}=useAuth();
    const [patients,setPatients]=useState([]);
    const [selectedPatient,setSelectedPatient]=useState("");
    const [vitals,setVitals]=useState({
        heartRate:"",
        systolicBP:"",
        diastolicBP:"",
        temperature:"",
        oxygenLevel:"",
        respiratoryRate:"",
        weight:"",
    });
    const [saving,setSaving]=useState(false);
    useEffect(()=>{
        getPatients();
    },[]);
    const getPatients=async()=>{
        try{
          const response=await fetch("http://localhost:5000/api/appointments/doctor-appointments",
            {
                headers:{
                    Authorization:authorizationToken
                }
            }
          );
          const data=await response.json();
          if(response.ok){
            const uniquePatients=[];
            data.data.forEach((appointment)=>{
                if(
                    appointment.patientId && !uniquePatients.some(
                        (patient)=>patient._id === appointment.patientId._id
                    )
                ) {
                    uniquePatients.push(appointment.patientId);
                }
            });
            setPatients(uniquePatients);
          }
        }catch(error){
            console.log("Patients error:",error);
        }
    };
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setVitals({
            ...vitals,
            [name]:value
        });
    };
    const saveVitals=async()=>{
        if(!selectedPatient){
       alert("Please select a patient");
       return;
        }
        try{
         setSaving(true);
         const response=await fetch(
            "http://localhost:5000/api/vitals/add",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:authorizationToken
                },
                body:JSON.stringify({
                    patientId:selectedPatient,
                    ...vitals
                })
            }
         );
         const data=await response.json();
         if(response.ok){
            toast.success("Vital health metrics saved successfully");
            setVitals({
                heartRate:"",
                systolicBP:"",
                diastolicBP:"",
                temperature:"",
                oxygenLevel:"",
                respiratoryRate:"",
                weight:""
            });
         } else {
            alert(data.message || "Unable to save vitals");
         }
        }catch(error){
          console.log("Save vitals error:",error);
          toast.error("Unable to save vital health metrics");
        } finally {
            setSaving(false);
        }
    };
      return (
        <div className="doctor-record-vital-page">

            <div className="record-vital-card">

                <div className="record-vital-header">
                    <span>❤️</span>
                    <div>
                        <h1>Record Vital Health Metrics</h1>
                        <p>Record the latest health measurements of your patient</p>
                    </div>
                </div>

                <div className="patient-select-section">
                    <label>Select Patient</label>

                    <select
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                    >
                        <option value="">
                            -- Select Patient --
                        </option>

                        {patients.map((patient) => (
                            <option
                                key={patient._id}
                                value={patient._id}
                            >
                                {patient.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="vital-form-grid">

                    <div>
                        <label>Heart Rate</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                name="heartRate"
                                value={vitals.heartRate}
                                onChange={handleChange}
                                placeholder="78"
                            />
                            <span>BPM</span>
                        </div>
                    </div>

                    <div>
                        <label>Systolic BP</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                name="systolicBP"
                                value={vitals.systolicBP}
                                onChange={handleChange}
                                placeholder="120"
                            />
                            <span>mmHg</span>
                        </div>
                    </div>

                    <div>
                        <label>Diastolic BP</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                name="diastolicBP"
                                value={vitals.diastolicBP}
                                onChange={handleChange}
                                placeholder="80"
                            />
                            <span>mmHg</span>
                        </div>
                    </div>

                    <div>
                        <label>Temperature</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={vitals.temperature}
                                onChange={handleChange}
                                placeholder="98.6"
                            />
                            <span>°F</span>
                        </div>
                    </div>

                    <div>
                        <label>Oxygen Level</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                name="oxygenLevel"
                                value={vitals.oxygenLevel}
                                onChange={handleChange}
                                placeholder="98"
                            />
                            <span>%</span>
                        </div>
                    </div>

                    <div>
                        <label>Respiratory Rate</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                name="respiratoryRate"
                                value={vitals.respiratoryRate}
                                onChange={handleChange}
                                placeholder="16"
                            />
                            <span>/min</span>
                        </div>
                    </div>

                    <div>
                        <label>Weight</label>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                step="0.1"
                                name="weight"
                                value={vitals.weight}
                                onChange={handleChange}
                                placeholder="68"
                            />
                            <span>kg</span>
                        </div>
                    </div>

                </div>

                <button
                    className="save-vital-button"
                    onClick={saveVitals}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "💾 Save Vital Metrics"}
                </button>
                        <button
    className="back-dashboard-btn"
    onClick={() => navigate("/doctor-dashboard")}
>
    ← Back to Dashboard
</button>
                    
                </div>
            </div>

    )
}
export default VitalRecords;
