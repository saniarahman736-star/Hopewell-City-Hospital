import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
export const Register=() =>{
    const [user,setUser]=useState({
        username:"",
        email:"",
        phone:"",
        password:"",
        role:"",
    });
    const navigate=useNavigate();
    const handleInput=(e)=>{
        console.log(e);
        let name=e.target.name;
        let value=e.target.value;

        setUser({
            ...user,
            [name]:value,
        });
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
        const response = await fetch(
            `http://localhost:5000/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            }
        );

        const res_data = await response.json();

        console.log("res from server", res_data);

        if (response.ok) {

            // Do NOT store token here
            // Registration should NOT automatically log the user in

            setUser({
                username: "",
                email: "",
                phone: "",
                password: "",
                role: ""
            });

            toast.success("Registration Successful! Please login.");

            navigate("/login");

        } else {
            toast.error(
                res_data.extraDetails
                    ? res_data.extraDetails
                    : res_data.message
            );
        }

        console.log(response);

    } catch (error) {
        console.log("register", error);
        toast.error("Registration failed. Please try again.");
    }
};
    return (
        <>
        <div style={{
    backgroundImage: "url('/images/doctorpic1.jpg.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
  >
        <div className="registration-form">
            <h1 className="main-heading">Registration Form</h1>
            <br/>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                    type="text"
                    name="username"
                    placeholder="Kindly enter your username"
                    id="username"
                    required
                    autoComplete="off"
                    value={user.username}
                    onChange={handleInput}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                    type="email"
                    name="email"
                    placeholder="Kindly enter your email"
                    id="email"
                    required
                    autoComplete="off"
                    value={user.email}
                    onChange={handleInput}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                    type="number"
                    name="phone"
                    placeholder="Kindly enter your phone number"
                    id="phone"
                    required
                    autoComplete="off"
                    value={user.phone}
                    onChange={handleInput}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    name="password"
                    placeholder="Kindly enter your password"
                    id="password"
                    required
                    autoComplete="off"
                    value={user.password}
                    onChange={handleInput}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="role">Role</label>
                    <select
                    type="text"
                    name="role"
                    placeholder="Kindly enter your role"
                    id="role"
                    required
                    autoComplete="off"
                    value={user.role}
                    onChange={handleInput}
                    > 
                        <option value="">Select Role</option>
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>  
                    </select>   
                </div>
                <br/>
                <button type="submit" className="btn btn-submit">
                    Register Now
                </button>
            </form>
        </div>
        </div>
        <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
           </footer>
        </>
    )
}
export default Register;