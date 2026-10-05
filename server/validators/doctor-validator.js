const {z}=require("zod");
const doctorSchema=z.object({
    userId:z
        .string({required_error:"UserId is required"})
        .trim()
        .min(10,{message:"UserId must be of atleast 10 characters"})
        .max(30,{message:"UserId must not exceed more than 30 characters"}), 
    specialization:z
        .string()
        .trim()
        .min(2,{message:"Specialization is required"}),
    qualification:z
        .string()
        .trim()
        .min(2,{message:"Qualification is required"}), 
    experience:z
        .number()
        .min(0,{message:"Experience cannot be negative"}), 
    consultationFee:z
        .number()
        .min(0,{message:"Consultation Fee cannot be negative"}),
    availableDays:z.array(z.string()).min(1,{message:"Select atleast one available day"}),
    availableTime: z
    .array(z.string())
    .min(1, { message: "Select at least one available time slot" }),
    
});
module.exports={doctorSchema};