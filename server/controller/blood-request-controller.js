const BloodRequest=require("../models/BloodRequest");
const createBloodRequest=async(req,res)=>{
    try{
     const {
        bloodGroup,
        unitsRequired,
        requiredDate,
        reason
     }=req.body;
     if(!bloodGroup || !unitsRequired || !requiredDate || !reason){
        return res.status(400).json({
            message:"All fields are required"
        })
     }
     const bloodRequest=await BloodRequest.create({
        patientId:req.userID,
        bloodGroup,
        unitsRequired,
        requiredDate,
        reason
     });
     res.status(200).json({
        message:"Blood request submitted successfully",
        request:bloodRequest
     })
    }catch(error){
      console.error("Create Blood Request Error:",error);
      res.status(500).json({
        message:"Failed to create blood request"
      })
    }
}
const getMyBloodRequests=async(req,res)=>{
    try{
       const requests=await getMyBloodRequests.find({
        patientId:req.userID
       }).sort({createdAt:-1});
       res.status(200).json({
        message:"Blood requests fetched successfully",
        requests
       });
    }catch(error){
        console.error("Get Blood Requests Error:",error);
        res.status(500).json({
            message:"Failed to fetch blood requests"
        })
    }
};
module.exports={
    createBloodRequest,getMyBloodRequests
}