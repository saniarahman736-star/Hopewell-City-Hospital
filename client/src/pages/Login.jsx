import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../store/auth";
import {toast} from "react-toastify";
export const Login=() =>{
    const[user,setUser]=useState({
        email:"",
        password:"",
    });
    const navigate=useNavigate();
    const { storeTokenInLS }=useAuth();
    const handleInput=(e)=>{
        console.log(e);
        let name=e.target.name;
        let value=e.target.value;
        setUser({
            ...user,
            [name]:value,
        });
    };
    const handleSubmit=async(e)=>{
        e.preventDefault();
        console.log(user);
        try{
            const response=await fetch(`http://localhost:5000/api/auth/login`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(user),
            });
            console.log("login form",response);
            const res_data=await response.json();
            if(response.ok){
                storeTokenInLS(res_data.token);
                setUser({email:"",password:""});
                toast.success("Login Successful");
                localStorage.setItem("token", res_data.token);

if (res_data.role === "doctor") {

    const profileResponse = await fetch(
        "http://localhost:5000/api/doctor/my-profile",
        {
            headers: {
                Authorization: `Bearer ${res_data.token}`
            }
        }
    );

    if (profileResponse.ok) {
        navigate("/doctor-dashboard");
    } else {
        navigate("/doctor-profile");
    }

} else if (res_data.role === "patient") {

    const profileResponse = await fetch(
        "http://localhost:5000/api/patients/profile",
        {
            headers: {
                Authorization: `Bearer ${res_data.token}`
            }
        }
    );

    if (profileResponse.ok) {
        navigate("/patient/dashboard");
    } else {
        navigate("/patient");
    }

} else if (res_data.role === "admin") {

    navigate("/admin");

}
            }else{
                toast.error(res_data.extraDetails?res_data.extraDetails:res_data.message);
                console.log("Invalid Credentials");
            }
            //console.log(response);
        }catch(error){
            console.log("login",error);
        }
    };
    return (
        <>
        <div style={{
            backgroundImage:"url('/images/doctorpic4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}

        >
        <div className="login-section">
            <div className="login-container">
                <div className="image-part">
                    <img src="/images/doctorpic6.jpg"
                    alt="a doctor with patient"
                    />
                </div>
                <div className="login-form">
          <h1 className="main-heading">Login Form</h1>
          <br/>
          <form onSubmit={handleSubmit}>
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
            <br/>
            <button type="submit" className="btn btn-submit">
                Submit 
            </button>
          </form>
          </div>
          </div>
         </div>
        </div>
        <footer>
            <p>© 2026 HopeWell City Hospital. All Rights Reserved.</p>
           </footer>
        </>
    )
   
}