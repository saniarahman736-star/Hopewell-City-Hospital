const User=require("../models/user-model");
const bcrypt=require("bcryptjs");
const home=async(req,res)=>{
    try{
        res.status(200).send(
            "Welcome to online hospital management system using controller"
        );
    }catch(error){
        console.log(error);
    }
};
const register=async(req,res)=>{
     try{
        const {username,email,phone,password,role}=req.body;
        const UserExist=await User.findOne({email:email});
        if(UserExist){
            return res.status(400).json({message:"email already exists"});
        }
        //const saltRound=10;
       // const hash_password=await bcrypt.hash(password,saltRound);
        const data=await User.create({
            username,
            email,
            phone,
            password,
            role,
        });
        res.status(201).json({
            msg:"Registration Successful",data,
            token:await data.generateToken(),
            userId:data._id.toString(),

        });
    }catch(error){
        console.log(error);
        res.status(500).json({
        msg: "Internal Server Error",
        error: error.message,
        });
    }
}
const login=async(req,res)=>{
    try{
       const {email,password}=req.body;
       const userExist=await User.findOne({email});
       console.log(userExist);
       if(!userExist){
        return res.status(400).json({message:"Invalid Credentials"});
       }
       const user=await userExist.comparePassword(password);
       if(user){
        res.status(200).json({
            msg:"Login Successful",
            token:await userExist.generateToken(),
            userId:userExist._id.toString(),
            role:userExist.role,
        });
       }else{
        res.status(401).json({message:"Invalid email or password"});
       }
    }catch(error){
        //res.status(500).json("internal server error");
        next(error);
    }
}
const user=async(req,res)=>{
    try{
      const userData=req.user;
      console.log(userData);
      return res.status(200).json({userData:req.user});
    }catch(error){
        console.log(`error from the user route ${error}`);
    }
};
module.exports={home,register,login,user};