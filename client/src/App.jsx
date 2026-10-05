import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import { Navbar } from "./components/Navbar";

import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Contact from "./pages/Contact";

import Patient from "./pages/Patient";
import { PatientInfo } from "./pages/Patientinfo";
import PatientDashboard from "./pages/PatientDashboard";

import DoctorProfile from "./pages/DoctorProfile";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDetails from "./pages/PatientDetails";
import DoctorAppointments from "./pages/DoctorAppointments";
import PatientPrescription from "./pages/PatientPrescription";
import Appointment from "./pages/Appointment";
import ViewAppointment from "./pages/ViewAppointment";
import DoctorPrescription from "./pages/DoctorPrescription";
import VitalRecords from "./pages/VitalRecords";
import Medications from "./pages/Medications";
import Checkout from "./pages/Checkout";
import BloodBank from "./pages/BloodBank";
import EmergencyAdmission from "./pages/EmergencyAdmission";
import Notification from "./pages/Notification";
const AppContent = () => {

    const location = useLocation();

    const hideNavbar =
        location.pathname === "/doctor-dashboard" ||
        location.pathname === "/doctor-profile" ||
        location.pathname.startsWith("/doctor/") ||
        location.pathname === "/patient/dashboard" ||
        location.pathname.startsWith("/patient/") ||
        location.pathname === "/medications" ||
        location.pathname === "/checkout" ||
        location.pathname === "/blood-bank" ||
        location.pathname === "/emergency-admission";


    return (
        <>
            {!hideNavbar && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />
                <Route 
                  path="/contact"
                  element={<Contact />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
                <Route
                    path="/patient"
                    element={<Patient />}
                />
                <Route
                    path="/patient/info"
                    element={<PatientInfo />}
                />

                <Route
                    path="/patient/dashboard"
                    element={<PatientDashboard />}
                />
                <Route
                    path="/doctor-profile"
                    element={<DoctorProfile />}
                />

                <Route
                    path="/doctor-dashboard"
                    element={<DoctorDashboard />}
                />

                <Route
                    path="/doctor/appointments"
                    element={<DoctorAppointments />}
                />

                <Route
                    path="/doctor/patient/:id"
                    element={<PatientDetails />}
                />
                <Route
                    path="/appointment"
                    element={<Appointment />}
                />
                <Route
                    path="/appointment/view"
                    element={<ViewAppointment />}
                />
                <Route
                    path="/doctor/prescriptions"
                    element={<DoctorPrescription />}
                />
                <Route 
                    path="/doctor/record-vital"
                    element={<VitalRecords />}
                />
                <Route
                    path="/patient/prescriptions"
                    element={<PatientPrescription />}
                />
                <Route
                    path="/medications"
                    element={<Medications />}
                />
                <Route path="/checkout" 
                element={<Checkout />} 
                />
                <Route path="/blood-bank" 
                element={<BloodBank />} 
                />
                <Route path="/emergency-admission" 
                element={<EmergencyAdmission />} 
                />
                <Route path="/notification" 
                element={<Notification />} 
                />
            </Routes>
        </>
    );
};


const App = () => {

    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );

};


export default App;