const express=require("express");
const router=express.Router();
const{
    addVital,getPatientVitals,getMyVitals
}=require("../controller/vital-controller");
const authMiddleware=require("../middlewares/auth-middleware");
router.post("/add",authMiddleware,addVital);
router.get("/patient/:patientId",authMiddleware,getPatientVitals);
router.get("/my",authMiddleware,getMyVitals);
module.exports=router;