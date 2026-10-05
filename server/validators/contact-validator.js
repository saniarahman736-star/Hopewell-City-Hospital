const {z}=require("zod");
const contactSchema=z.object({
    username:z
        .string({required_error:"Name is required"})
        .trim()
        .min(3,{message:"Name must be of atleast 3 characters"})
        .max(255,{message:"Name must not exceed more than 255 characters"}), 
    email:z
        .string({required_error:"Email is required"})
        .trim()
        .email({message:"Invalid email address"})
        .min(3,{message:"Email must be of atleast 3 characters"})
        .max(255,{message:"Email must not exceed more than 255 characters"}), 
    phone:z
        .string({required_error:"Phone number is required"})
        .trim()
        .min(10,{message:"Phone number must be of 10 characters"})
        .max(20,{message:"Must not exceed more than 20 characters"}), 
    message:z
        .string({required_error:"Subject is required"})
        .trim()
        .min(10,{message:"Subject must be of 10 characters"})
        .max(20,{message:"Subject not exceed more than 20 characters"}), 
    
    
})

module.exports={contactSchema};