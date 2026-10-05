import {useState,useEffect} from "react";
import {useAuth} from "../store/auth";
import "./BloodBank.css";
const BloodBank=()=>{
    const {authorizationToken}=useAuth();
    const [inventory,setInventory]=useState([]);
    const [loading,setLoading]=useState(true);
    const [showRequestForm,setShowRequestForm]=useState(false);
    const [selectedBloodGroup,setSelectedBloodGroup]=useState("");
    const [formData,setFormData]=useState({
        unitsRequired:"",
        requiredDate:"",
        reason:"",
    });
    const [requestMessage,setRequestMessage]=useState("");
    useEffect(()=>{
        const getBloodInventory=async()=>{
            try{
             const response=await fetch("http://localhost:5000/api/blood-inventory",
                {
                    method:"GET",
                    headers:{
                        Authorization:authorizationToken
                    }
                }
             );
             const data=await response.json();
             if(response.ok){
                setInventory(data.inventory || []);
             } else {
                setInventory([]);
             }
            }catch(error){
             console.log("Blood Inventory error:",error);
             setInventory([]);
            } finally {
                setLoading(false);
            }
        };
        if(authorizationToken){
            getBloodInventory();
        }
    },[authorizationToken]);
    const handleRequestClick=(bloodGroup)=>{
        setSelectedBloodGroup(bloodGroup);
        setShowRequestForm(true);
        setRequestMessage("");
    };
    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await fetch(
                "http://localhost:5000/api/blood-requests",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:authorizationToken
                    },
                    body:JSON.stringify({
                        bloodGroup:selectedBloodGroup,
                        unitsRequired:Number(formData.unitsRequired),
                        requiredDate:formData.requiredDate,
                        reason:formData.reason
                    })
                }
            );
            const data=await response.json();
            if(response.ok){
                setRequestMessage("Blood request submitted successfully");
                setFormData({
                    unitsRequired:"",
                    requiredDate:"",
                    reason:""
                });
            } else {
                setRequestMessage(
                    data.message || "Failed to submit blood request"
                )
            }
        }catch(error){
            console.log("Blood request error:",error);
            setRequestMessage("Something went wrong.Please try again");
        }
    };
    return (
        <div className="blood-bank-page">

            <div className="blood-bank-header">
                <div>
                    <span className="blood-icon">🩸</span>
                    <h1>Blood Bank</h1>
                    <p>
                        Check blood availability and request blood when needed.
                    </p>
                </div>
            </div>

            <div className="blood-bank-info">
                <div>
                    <span>🏥</span>
                    <div>
                        <h3>HopeWell City Hospital</h3>
                        <p>Kolkata, West Bengal</p>
                    </div>
                </div>

                <div>
                    <span>🩸</span>
                    <div>
                        <h3>Blood Availability</h3>
                        <p>Updated hospital inventory</p>
                    </div>
                </div>
            </div>

            <section className="blood-section">

                <div className="section-heading">
                    <div>
                        <h2>Available Blood</h2>
                        <p>Current blood units available at our hospital</p>
                    </div>
                </div>

                {loading ? (
                    <div className="blood-loading">
                        <span>🩸</span>
                        <h3>Loading blood availability...</h3>
                    </div>
                ) : inventory.length === 0 ? (
                    <div className="blood-empty">
                        <span>🩸</span>
                        <h3>No blood inventory available</h3>
                        <p>Please check again later.</p>
                    </div>
                ) : (
                    <div className="blood-grid">
                        {inventory.map((blood) => (
                            <div
                                className="blood-card"
                                key={blood._id}
                            >
                                <div className="blood-card-top">
                                    <div className="blood-group">
                                        {blood.bloodGroup}
                                    </div>

                                    <span
                                        className={
                                            blood.unitsAvailable > 5
                                                ? "available"
                                                : blood.unitsAvailable > 0
                                                ? "low"
                                                : "unavailable"
                                        }
                                    >
                                        {blood.unitsAvailable > 5
                                            ? "Available"
                                            : blood.unitsAvailable > 0
                                            ? "Low Stock"
                                            : "Unavailable"}
                                    </span>
                                </div>

                                <div className="blood-units">
                                    <strong>
                                        {blood.unitsAvailable}
                                    </strong>
                                    <span>units available</span>
                                </div>

                                <div className="blood-details">
                                    <p>🏥 {blood.hospital}</p>
                                    <p>📍 {blood.location}</p>
                                </div>

                                <button
                                    className="request-blood-btn"
                                    disabled={blood.unitsAvailable === 0}
                                    onClick={() =>
                                        handleRequestClick(
                                            blood.bloodGroup
                                        )
                                    }
                                >
                                    {blood.unitsAvailable === 0
                                        ? "Unavailable"
                                        : "Request Blood"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {showRequestForm && (
                <div className="blood-modal-overlay">

                    <div className="blood-modal">

                        <button
                            className="close-modal"
                            onClick={() => setShowRequestForm(false)}
                        >
                            ✕
                        </button>

                        <div className="modal-header">
                            <span>🩸</span>
                            <div>
                                <h2>Request Blood</h2>
                                <p>
                                    Blood Group:{" "}
                                    <strong>{selectedBloodGroup}</strong>
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label>Required Units</label>

                                <input
                                    type="number"
                                    name="unitsRequired"
                                    min="1"
                                    value={formData.unitsRequired}
                                    onChange={handleChange}
                                    placeholder="Enter number of units"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Required Date</label>

                                <input
                                    type="date"
                                    name="requiredDate"
                                    value={formData.requiredDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Reason</label>

                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    placeholder="Example: Surgery, emergency, treatment..."
                                    rows="4"
                                    required
                                />
                            </div>

                            {requestMessage && (
                                <div className="request-message">
                                    {requestMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="submit-request-btn"
                            >
                                Submit Blood Request
                            </button>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};
export default BloodBank;