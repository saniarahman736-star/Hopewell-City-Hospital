require("dotenv").config();
const express=require("express");
const cors=require("cors");
const app=express();
const router=require("./router/auth-router");
const connectDb=require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const contact=require("./router/contact-router");
const doctorRouter=require("./router/doctor-router");
const patientRouter=require("./router/patient-router");
const prescriptionRouter=require("./router/prescription-router")
const appointmentRouter=require("./router/appointment-router");
const vitalRouter=require("./router/vital-router");
const medicineRouter=require("./router/medicine-router");
const bloodInventoryRouter = require("./router/blood-inventory-router");
const bloodRequestRouter = require("./router/blood-request-router");
const emergencyAdmissionRouter=require("./router/admission-router");
const notificationRouter=require("./router/push-router");
const corsOption={
    origin:"http://localhost:5173",
    method:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true,
};
const {
    startNotificationScheduler
}=require("./utils/notification-scheduler")
app.use(cors(corsOption));
app.use(express.json());
app.use("/api/auth",router);
app.use("/api/contact",contact);
app.use("/api/patients",patientRouter);
app.use("/api/appointments",appointmentRouter);
app.use("/api/prescriptions",prescriptionRouter);
app.use("/api",doctorRouter);
app.use("/api/vitals",vitalRouter);
app.use("/api/medicines",medicineRouter);
app.use("/api/blood-inventory", bloodInventoryRouter);
app.use("/api/blood-requests", bloodRequestRouter);
app.use("/api/emergency-admissions",emergencyAdmissionRouter);
app.use("/api/notifications", notificationRouter);
app.use(errorMiddleware);
const PORT=5000;
connectDb().then(()=>{
app.listen(PORT,()=>{
    console.log(`server is running at port:${PORT}`);
    startNotificationScheduler();
});
});