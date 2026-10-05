const express=require("express");
const router=express.Router();
const {
    createEmergencyAdmission,getMyEmergencyAdmission
}=require("../controller/admission-controller");
const authMiddleware=require("../middlewares/auth-middleware");
router.post(
    "/",authMiddleware,createEmergencyAdmission
);
router.get(
    "/my-admissions",authMiddleware,getMyEmergencyAdmission
);
module.exports=router;