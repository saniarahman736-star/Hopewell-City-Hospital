const {Schema,model}=require("mongoose");
const appointmentSchema=new Schema ({
    patientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    },
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:"Doctor",
        required:true,
    },
    appointmentDate:{
        type:String,
        required:true,
    },
    appointmentTime:{
        type:[String],
        required:true,
    },
    reason:{
        type:String,
        required:true,
        trim:true,
    },
    status:{
        type:String,
        enum:["Pending","Completed","Confirmed","Cancelled"],
        default:"Pending",
    },
},{
    timestamps:true}
);
const Appointment=model("Appointment",appointmentSchema);
module.exports=Appointment;