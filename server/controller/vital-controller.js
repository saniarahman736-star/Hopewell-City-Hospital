const Vital=require("../models/vital-model");
const Doctor=require("../models/doctor-model");
const Patient=require("../models/patient-model");
const addVital=async(req,res)=>{
    try{
       const {
        patientId,
        heartRate,
        systolicBP,
        diastolicBP,
        temperature,
        oxygenLevel,
        respiratoryRate,
        weight
       } =req.body;
       const doctor = await Doctor.findOne({
            userId: req.userID
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor profile not found"
            });
        }
        const patient = await Patient.findOne({
    userId: patientId
});

if (!patient) {
    return res.status(404).json({
        message: "Patient profile not found"
    });
}

       const vital=await Vital.create({
        patientId:patient._id,
        doctorId:doctor._id,
        heartRate,
        systolicBP,
        diastolicBP,
        temperature,
        oxygenLevel,
        respiratoryRate,
        weight
       });
       res.status(200).json({
        message:"Vital health metrics added successfully",
        data:vital
       });
    }catch(error){
    console.log("VITAL ERROR:", error);
    res.status(500).json({
        message: error.message,
    });
}
};
const getPatientVitals=async(req,res)=>{
    try{
      const vitals=await Vital.find({
        patientId:req.params.patientId,
      })
      .populate("doctorId","userId")
      .sort({createdAt:-1});
      res.status(200).json({
        data:vitals,
      });
    }catch(error){
      console.log(error);
      res.status(500).json({
        message:"Unable to fetch vital health metrics"
      });
    }
}
const getMyVitals=async(req,res)=>{
    try{
      const patient=await Patient.findOne({
        userId:req.userID,
      });
      if(!patient){
        return res.status(400).json({
            message:"Patient profile not found"
        })
      }
      const vitals=await Vital.find({
        patientId:patient._id,
      }).sort({createdAt:-1});
      res.status(200).json({
        data:vitals,
      });
    }catch(error){
       console.log(error);
       res.status(500).json({
        message:"Unable to fetch your vital health metrics"
       });
    }
};
module.exports={
    addVital,getPatientVitals,getMyVitals
}