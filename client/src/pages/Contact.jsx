import React, { useState } from "react";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
export const Contact = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const navigate=useNavigate();
  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(contact);
     try{
        const response=await fetch("http://localhost:5000/api/contact",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(contact)
        });
        const res_data=await response.json();
        if(response.ok){
            setContact({name: "",email: "",phone: "",message: "",});
            toast.success("Your message has been sent successfully!");
            navigate("/");
        }else{
            toast.error(res_data.extraDetails?res_data.extraDetails:res_data.message)
        }
        console.log(response);
     }catch(error){
        console.log("contact",error)
     }
  }
  

  return (
    <>
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>
          We'd love to hear from you. If you have any questions, feedback or
          need assistance, feel free to contact us.
        </p>
      </div>

      <div className="contact-content">

        <div className="contact-info">

          <div className="info-card">
            <h3>📍 Address</h3>
            <p>
              HopeWell City Hospital
              <br />
              Kolkata, West Bengal
              <br />
              India
            </p>
          </div>

          <div className="info-card">
            <h3>📞 Phone</h3>
            <p>+91 9876543210</p>
          </div>

          <div className="info-card">
            <h3>📧 Email</h3>
            <a href="mailto:support@hopewehospital.com">support@hopewehospital.com</a>
          </div>

          <div className="info-card">
            <h3>🕒 Working Hours</h3>
            <p>
              Monday - Saturday
              <br />
              9:00 AM - 8:00 PM
            </p>
          </div>

        </div>

        <div className="contact-form-section">
          <form onSubmit={handleSubmit} className="contact-form">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={contact.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={contact.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={contact.phone}
              onChange={handleChange}
              required
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Write your message..."
              value={contact.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>

          </form>
        </div>

      </div>

      <div className="map-section">
        <h2>Find Us</h2>

         <iframe
  title="Hospital Location"
  src="https://www.google.com/maps?q=Kolkata,West+Bengal&output=embed"
  width="100%"
  height="350"
  style={{ border: 0 }}
  loading="lazy"
  allowFullScreen
></iframe>
      </div>

    </div>
    
    <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
     </footer>
     </>
    )
} 
export default Contact;  

