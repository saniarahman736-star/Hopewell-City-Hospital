const {Schema,model}=require("mongoose");
const doctorSchema=new Schema ({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    specialization:{
        type:String,
        required:true,
    },
    qualification:{
        type:String,
        required:true,
    },
    experience:{
        type:Number,
        required:true,
    },
    consultationFee:{
        type:Number,
        required:true,
    },
    availableDays:{
        type:[String],
        required:true,
    },
    availableTime:{
        type:[String],
        required:true,
    },
});
const Doctor=model("Doctor",doctorSchema);
module.exports=Doctor;