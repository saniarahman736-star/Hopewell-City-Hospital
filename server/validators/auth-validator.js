const {z}=require("zod");
const signupSchema=z.object({
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
    password:z
        .string({required_error:"Password is required"})
        .trim()
        .min(8,{message:"Password must be of atleast 8 characters"})
        .max(100,{message:"Password cannot be greater than 100 characters"}), 
    role:z
        .string({required_error:"Role is required"})
        .trim()
        .refine(
            (value)=>["admin","doctor","patient"].includes(value),
            {
                message:"Role must be admin,doctor or patient",
            }
        ) 
    
});
const loginSchema=z.object({
    email:z
        .string({required_error:"Email is required"})
        .trim()
        .email({message:"Invalid email address"})
        .min(3,{message:"Email must be of atleast 3 characters"})
        .max(255,{message:"Email must not exceed more than 255 characters"}), 
    password:z
        .string({required_error:"Password is required"})
        .trim()
        .min(8,{message:"Password must be of atleast 8 characters"})
        .max(100,{message:"Password cannot be greater than 100 characters"}), 
});
module.exports={signupSchema,loginSchema};