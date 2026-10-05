const jwt=require("jsonwebtoken");
const User=require("../models/user-model");
const authMiddleware=async(req,res,next)=>{
    const token=req.header("Authorization");
    if(!token){
        return res.status(400).json({message:"Unauthorized HTTP,Token not provided"});
    }
    const jwtToken=token.replace("Bearer","").trim();
    console.log("token from auth middleware",jwtToken);
    try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    console.log("Decoded JWT:", isVerified);

    const userData = await User.findOne({ email: isVerified.email })
        .select({
            password: 0,
        });

    console.log("User from DB:", userData);

    if (!userData) {
        return res.status(401).json({
            message: "User not found"
        });
    }

    req.user = userData;
    req.token = token;
    req.userID = userData._id;

    next();

} catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(401).json({
        message: "Unauthorized. Invalid token"
    });
}
};
module.exports=authMiddleware;