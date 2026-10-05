const express=require("express");
const router=express.Router();
const{
    createPrescription,
    getDoctorPrescriptions,
    getMyPrescriptions,
    downloadPrescriptionPDF,
}=require("../controller/prescription-controller");
const authMiddleware=require("../middlewares/auth-middleware");
router.post(
    "/",
    authMiddleware,
    createPrescription
);
router.get(
    "/doctor",
    authMiddleware,
    getDoctorPrescriptions
);
router.get(
    "/my",
    authMiddleware,
    getMyPrescriptions
);
router.get(
    "/:id/pdf",
    authMiddleware,
    downloadPrescriptionPDF
);
module.exports=router;