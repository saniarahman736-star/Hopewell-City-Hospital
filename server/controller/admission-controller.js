const Admission=require("../models/admission-model");
const createEmergencyAdmission=async(req,res)=>{
    try{
     const {
        emergencyType,
        symptoms,
        severity,
        emergencyContact
     }=req.body;
     if(
        !emergencyType ||
        !symptoms ||
        !severity ||
        !emergencyContact
     ){
        return res.status(400).json({
            message:"All fields are required"
        });
     }
     const admission=await Admission.create({
        patientId:req.userID,
        emergencyType,
        symptoms,
        severity,
        emergencyContact
     });
     res.status(200).json({
        message:"Emergency admission submitted successfully",
        admission
     })
    }catch(error){
      console.error("Create emergency admission error:",error);
      res.status(500).json({
        message:"Failed to submit emergency admission request"
      });
    }
}
const getMyEmergencyAdmission=async(req,res)=>{
    try{
      const admissions=await Admission.find({
        patientId:req.userID
      }).sort({createdAt:-1});
      res.status(200).json({
        message:"Emergency admission fetched successfully",
        admissions
      });
    }catch(error){
      console.error("Get emergency admission error:",error);
      res.status(500).json({
        message:"Failed to fetch emergency admissions"
      });
    }
};
module.exports={
    createEmergencyAdmission,
    getMyEmergencyAdmission
};