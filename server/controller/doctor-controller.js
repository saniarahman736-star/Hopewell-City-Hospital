const Doctor=require("../models/doctor-model");
const doctor=async(req,res)=>{
    try{
       const response=await Doctor.find().populate("userId","username");
       if(response.length === 0){
        return res.status(404).json({msg:"No doctors found"});
       }
       res.status(200).json({
        msg:"Doctors fetched successfully",
        data:response,
       });
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal server error"});
    }
};
const createDoctor=async(req,res)=>{
    try{
       const newDoctor=await Doctor.create(req.body);
       res.status(201).json({
        msg:"Doctors added successfully",
        data:newDoctor,
       });
    } catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal server error"});
    }
};
const getDoctorById=async(req,res)=>{
    try{
       const doctor=await Doctor.findById(req.params.id);
       if(!doctor){
        return res.status(400).json({msg:"Doctors Not Found"});
       }
       res.status(200).json({
        msg:"Doctors Fetched Successfully",
        data:doctor,
    });
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server Error"});
    }
}
const getMyDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            userId: req.userID
        }).populate("userId", "username email phone");

        if (!doctor) {
            return res.status(404).json({
                msg: "Doctor profile not found"
            });
        }

        res.status(200).json({
            msg: "Doctor profile fetched successfully",
            data: doctor
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
const updateMyDoctorProfile = async (req, res) => {
    try {
        let doctor = await Doctor.findOne({
            userId: req.userID
        });

        if (doctor) {
            doctor.specialization = req.body.specialization;
            doctor.qualification = req.body.qualification;
            doctor.experience = req.body.experience;
            doctor.consultationFee = req.body.consultationFee;
            doctor.availableDays = req.body.availableDays;
            doctor.availableTime = req.body.availableTime;

            await doctor.save();

        } else {
            doctor = await Doctor.create({
                userId: req.userID,
                specialization: req.body.specialization,
                qualification: req.body.qualification,
                experience: req.body.experience,
                consultationFee: req.body.consultationFee,
                availableDays: req.body.availableDays,
                availableTime: req.body.availableTime
            });
        }

        await doctor.populate("userId", "username email phone");

        res.status(200).json({
            msg: "Doctor profile saved successfully",
            data: doctor
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal server error"
        });
    }
};


module.exports={doctor,createDoctor,getDoctorById,getMyDoctorProfile,updateMyDoctorProfile};