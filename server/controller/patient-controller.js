const Patient=require("../models/patient-model");
const patient = async (req, res) => {
    try {
        const response = await Patient.find();

        if (response.length === 0) {
            return res.status(404).json({
                msg: "No Patients Found"
            });
        }

        res.status(200).json({
            msg: "Patients fetched successfully",
            data: response,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
};


const createPatient = async (req, res) => {
    try {
        const userId = req.userID;
        const existingPatient=await Patient.findOne({ userId });
        if(existingPatient){
        return res.status(400).json({msg:"Patient profile already exists"});
    }
        const {
            age,
            gender,
            bloodGroup,
            address,
            emergencyContact,
            allergies,
            medicalHistory,
        } = req.body;

        const newPatient = await Patient.create({
            userId,
            age,
            gender,
            bloodGroup,
            address,
            emergencyContact,
            allergies,
            medicalHistory,
        });

        res.status(201).json({
            msg: "Patient profile created successfully",
            data: newPatient,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Internal Server Error"
        });
    }
};
const getPatientProfile=async(req,res)=>{
    try{
       const userId=req.userID;
       const patient=await Patient.findOne({userId});
       if(!patient){
        return res.status(404).json({msg:"Patient profile not found"});
       }
       res.status(200).json({
        data:patient,
    });
    }catch(error){
        console.log(error);
        res.status(500).json({msg:"Internal Server Error"});
    }
}
const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            userId: req.params.id
        }).populate(
            "userId",
            "username email phone"
        );

        if (!patient) {
            return res.status(404).json({
                msg: "Patient profile not found"
            });
        }

        res.status(200).json({
            msg: "Patient profile fetched successfully",
            data: patient
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Internal server error"
        });
    }
};
module.exports = { patient, createPatient, getPatientProfile,getPatientById }; 