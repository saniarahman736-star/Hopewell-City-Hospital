const mongoose=require("mongoose");
const URI=process.env.MONGODB_URI;
const connectDb=async()=>{
    try{
      await mongoose.connect(URI);
      console.log("connection successful to DB");
      console.log("Connected Database:", mongoose.connection.name);
      console.log("Connected Host:", mongoose.connection.host);
    }catch(error){
        console.error("database connection failed");
        console.error(error);
        
    }
};
module.exports=connectDb;