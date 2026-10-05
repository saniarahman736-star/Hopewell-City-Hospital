import { createContext, useContext,useState,useEffect } from "react";
export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));
    const [user,setUser]=useState(null);
    const storeTokenInLS=(serverToken)=>{
        setToken(serverToken);
        return localStorage.setItem("token",serverToken);
    };
let isLoggedIn=!!token;
console.log("isLoggedIN",isLoggedIn);
const LogoutUser=()=>{
    setToken(null);
    setUser("");
    return localStorage.removeItem("token");
}
const authorizationToken = token ? `Bearer ${token}` : "";

  const userAuthentication = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/user",
        {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User Data:", data);
        setUser(data.userData);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      userAuthentication();
    }
  }, [token]);

    return (
    <AuthContext.Provider value={{ isLoggedIn,storeTokenInLS,LogoutUser,user,authorizationToken, }}>
        {children}
    </AuthContext.Provider>
    );
};

export const useAuth=()=>{
    const authContextValue=useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the Provider");
    }
    return authContextValue;
}