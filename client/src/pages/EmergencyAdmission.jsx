import {useState} from "react";
import {useAuth} from "../store/auth";
import {toast} from "react-toastify";
import "./EmergencyAdmission.css";
const EmergencyAdmission=()=>{
    const {authorizationToken}=useAuth();
    const [formData,setFormData]=useState({
        emergencyType:"",
        symptoms:"",
        severity:"",
        emergencyContact:""
    });
    const [message,setMessage]=useState("");
    const [loading,setLoading]=useState(false);
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try{
          const response=await fetch(
            "http://localhost:5000/api/emergency-admissions",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    Authorization:authorizationToken
                },
                body:JSON.stringify(formData)
            }
          );
          const data=await response.json();
          if(response.ok){
                toast.success(
                    "Emergency admission request submitted successfully"
                );
            setFormData({
                emergencyType:"",
                symptoms:"",
                severity:"",
                emergencyContact:""
            });
          } else {
            toast.error(
                data.message || 
                "Failed to submit emergency admission request."
            );
          }
        }catch(error){
            console.log("Emergency Admission error:",error);
            toast.error(
                "Something went wrong.Please try again."
            )
        } finally {
            setLoading(false);
        }
    };
    return(
        <div className="emergency-page">
            <div className="emergency-hero">
                <div className="emergency-hero-content">
                    <div className="emergency-icon">
                        🚑
                    </div>
                    <div>
                        <h1>Emergency Admission</h1>
                        <p>Request immediate medical assistance from HopeWell City Hospital</p>
                    </div>
                </div>
                <div className="emergency-hotline">
                    <span>📞</span>
                    <div>
                        <small>Emergency Hotline</small>
                        <strong>9876543210</strong>
                    </div>
                </div>
            </div>
            <div className="emergency-alert">
                <div className="alert-icon">
                    ⚠️
                </div>
                <div>
                    <h3>Medical Emergency?</h3>
                    <p>If the situation is life threatening please call the emergency hotline immediately</p>
                </div>
            </div>
            <div className="emergency-content">
                <div className="emergency-info">
                    <div className="info-card">
                        <span className="info-card-icon">
                            🏥
                        </span>
                        <h3>24/7 Emeregency Care</h3>
                        <p>Our emergency department is available around the clock for urgent medical needs</p>
                    </div>
                    <div className="info-card">
                        <span className="info-card-icon">
                            🧑‍⚕️
                        </span>
                        <h3>Expert Medical Team</h3>
                        <p>Experienced doctors and medical staff are ready to respons to emergencies</p>
                    </div>
                    <div className="info-card">
                        <span className="info-card-icon">
                            🚑
                        </span>
                        <h3>Rapid Response</h3>
                        <p>Your emergency request will be reviewed by the hospital team as quickly as possible</p>
                    </div>
                </div>
                <div className="emergency-form-card">
                    <div className="form-header">
                        <span>🚨</span>
                    </div>
                    <h2>Emergency Admission Request</h2>
                    <p>Provide the following information so our medical team can respond appropriately</p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Emergency Type</label>
                        <select name="emergencyType"
                        value={formData.emergencyType}
                        onChange={handleChange}
                        required
                        >
                            <option value="">
                                Select emergency type
                            </option>
                            <option value="Accident">
                               Accident/Injury
                            </option>
                            <option value="Chest Pain">
                               Chest Pain
                            </option>
                            <option value="Breathing Difficulty">
                               Breathing Difficulty
                            </option>
                            <option value="Severe Bleeding">
                               Severe Bleeding
                            </option>
                            <option value="Stroke">
                               Stroke Symptoms
                            </option>
                            <option value="Unconsciousness">
                               Unconsciousness
                            </option>
                            <option value="Pregnancy Emergency">
                               Pregnancy Emergency
                            </option>
                            <option value="Other">
                               Other
                            </option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Severity</label>
                        <select name="severity"
                        value={formData.severity}
                        onChange={handleChange}
                        required
                        >
                            <option value="">
                                Select Severity
                            </option>
                            <option value="Critical">
                               🔴 Critical
                            </option>
                            <option value="Serious">
                                🟠 Serious
                            </option>
                            <option value="Moderate">
                               🟡 Moderate
                            </option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Current Symptoms/Condition </label>
                    <textarea
                     name="symptoms"
                     value={formData.symptoms}
                     onChange={handleChange}
                     placeholder="Describe the patient current condition,symptoms,injuries,pain etc."
                     rows="5"
                     required
                     />
                </div>
                <div className="form-group">
                    <label>Emergency Contact Number</label>
                    <input
                     type="tel"
                     name="emergencyContact"
                     value={formData.emergencyContact}
                     onChange={handleChange}
                     placeholder="Enter emergency contact required."
                     required
                     />
                </div>
                {message && (
                    <div className="emergency-message">
                        {message}
                    </div>
                )}
                <button type="submit"
                className="emergency-submit-btn"
                disabled={loading}
                >
                    {loading ? "Submitting Request..."
                    :"🚨 Submit Emergency Request"}
                </button>
            </form>
        </div>
        </div>
            <div className="hospital-emergency-footer">

                <div>
                    <strong>HopeWell City Hospital</strong>
                    <span>
                        Kolkata, West Bengal, India
                    </span>
                </div>

                <div>
                    <span>Emergency Department</span>
                    <strong>Open 24 × 7</strong>
                </div>

                <div>
                    <span>Emergency Hotline</span>
                    <strong>+91 9876543210</strong>
                </div>

            </div>

        </div>
    );
};

export default EmergencyAdmission;
