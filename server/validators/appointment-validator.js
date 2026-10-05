const {z}=require("zod");
const appointmentSchema=z.object({ 
    doctorId:z
        .string({required_error:"DoctorId is required"})
        .trim()
        .min(10,{message:"DoctorId must be of atleast 10 characters"})
        .max(30,{message:"DoctorId must not exceed more than 30 characters"}), 
    appointmentDate:z
        .string()
        .trim()
        .min(1,{message:"Appointment Date is required"}),
    appointmentTime:z
        .string()
        .trim()
        .min(1,{message:"Appointment time is required"}),
    reason:z
        .string()
        .trim()
        .min(5,{message:"Reason must be of atleast 5 characters"})
        .max(300,{message:"Reason must not exceed more than 300 characters"}), 
    status:z
        .enum(["Pending","Completed","Confirmed","Cancelled"])
        .optional(),     
});
module.exports={appointmentSchema};