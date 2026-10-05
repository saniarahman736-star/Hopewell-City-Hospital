const mongoose=require("mongoose");
const AdmissionSchema=new mongoose.Schema(
    {
        patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
        },
        emergencyType:{
            type:String,
            required:true
        },
        symptoms:{
            type:String,
            required:true
        },
        severity:{
            type:String,
            enum:["Critical","Serious","Moderate"],
            required:true
        },
        emergencyContact:{
            type:String,
            required:true
        },
        preferredHospital:{
            type:String,
            default:"HopeWell City Hospital"
        },
        status:{
            type:String,
            enum:[
                "Pending",
                "Accepted",
                "In Progress",
                "Completed",
                "Cancelled"
            ],
            default:"Pending"
        }
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model(
    "EmergencyAdmission",AdmissionSchema
);