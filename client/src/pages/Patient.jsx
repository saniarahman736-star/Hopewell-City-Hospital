import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../store/auth";
import {toast} from "react-toastify";
export const Patient=() =>{
    const {user}=useAuth();
    const { authorizationToken }=useAuth();
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
   // const {storeTokenInLS}=useAuth();
    const handleInput=(e)=>{
        console.log(e);
        let name=e.target.name;
        let value=e.target.value;
        setPatient({
            ...patient,
            [name]:name === "age" ? Number(value):value,
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(patient);
        const patientData={
          ...patient,
          allergies:patient.allergies
               ?patient.allergies.split(",").map(item=>item.trim())
               :[],
          medicalHistory:patient.medicalHistory
               ?patient.medicalHistory.split(",").map(item=>item.trim())
               :[],
        };
        try{
          const response=await fetch(`http://localhost:5000/api/patients/patient`,{
            method:"POST",
            
            headers:{
                "Content-Type":"application/json",
                Authorization:authorizationToken
            },

            body:JSON.stringify(patientData),
          });
          const res_data=await response.json();
          console.log("Response from backend:", res_data);
          
          if(response.ok){
            setPatient({
                        age:"",
                        gender:"",
                        bloodGroup:"",
                        address:"",
                        emergencyContact:"",
                        allergies:"",
                        medicalHistory:"",});
            toast.success("Profile Completion Successful");
            navigate("/patient/dashboard");
          }else{
            toast.error(res_data.extraDetails?res_data.extraDetails:res_data.message);
          }
          console.log(response);
        }catch(error){
          console.log("Profile Completion",error);
        }
    };
    return (
        <>
        <div className="user-welcome">
        <h2>Welcome, {user ? user.username:"Patient"}</h2>
        <p>Email:{user?.email}</p>
        <p className="user-role">Role: Patient</p>
        </div>
        <div className="registration-form">
           <h1 className="main-heading"> Patient Profile</h1>
                 <br />

                    <form onSubmit={handleSubmit}>
                        
                        <div className="input-group">
                            <label htmlFor="age">Age</label>
                            <input
                                type="number"
                                name="age"
                                placeholder="Enter your age"
                                id="age"
                                required
                                autoComplete="off"
                                value={patient.age}
                                onChange={handleInput}
                                
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="gender">Gender</label>

                            <select
                                type="text"
                                name="gender"
                                placeholder="Kindly enter your gender"
                                id="gender"
                                required
                                autoComplete="off"
                                value={patient.gender}
                                onChange={handleInput}
                                
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label htmlFor="bloodGroup">Blood Group</label>

                            <input
                                type="text"
                                name="bloodGroup"
                                placeholder="Enter blood group"
                                id="bloodGroup"
                                required
                                autoComplete="off"
                                value={patient.bloodGroup}
                                onChange={handleInput}
                                
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="address">Address</label>

                            <textarea
                                name="address"
                                placeholder="Enter your address"
                                value={patient.address}
                                required
                                autoComplete="off"
                                onChange={handleInput}
                                
                            ></textarea>
                        </div>

                        <div className="input-group">
                            <label htmlFor="emergencyContact">Emergency Contact</label>

                            <input
                                type="text"
                                name="emergencyContact"
                                placeholder="Emergency contact number"
                                required
                                autoComplete="off"
                                value={patient.emergencyContact}
                                onChange={handleInput}
                                
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="allergies">Allergies</label>

                            <textarea
                                name="allergies"
                                placeholder="Any particular kind of allergy"
                                value={patient.allergies}
                                onChange={handleInput}
                            ></textarea>
                        </div>


                        <div className="input-group">
                            <label htmlFor="medicalHistory">Medical History</label>

                            <textarea
                                name="medicalHistory"
                                placeholder="Any previous disease"
                                value={patient.medicalHistory}
                                onChange={handleInput}
                            ></textarea>
                        </div>

                        <br />

                        <button
                            type="submit"
                            className="btn btn-submit"
                        >
                            Save Profile
                        </button>

                    </form>

                </div>
            
        

    <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
     </footer>
     </>
    )
}
export default Patient;