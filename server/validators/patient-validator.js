const {z}=require("zod");
const patientSchema=z.object({
    age:z
        .coerce
        .number()
        .min(0,{message:"Age cannot be negative"})
        .max(120,{message:"Invalid age"}),
    gender:z.enum(["Male","Female","Other"],{
        errorMap:()=>({message:"Invalid gender"}),
    }),
    bloodGroup:z.enum(["A+","B+","O+","A-","B-","O-","AB+","AB-"],{
        errorMap:()=>({message:"Invalid bloodgroup"}),
    }),
    address:z
        .string()
        .trim()
        .min(5,{message:"Address is required"}), 
    emergencyContact:z
        .string()
        .trim()
        .min(10,{message:"Emergency Contact must be of 10 characters"})
        .max(20,{message:"Must not exceed more than 20 characters"}),
    allergies:z
        .array(z.string())
        .optional(),
    medicalHistory:z
        .array(z.string())
        .optional(), 
});
module.exports={patientSchema};