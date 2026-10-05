const express=require("express");
const router=express.Router();
const patientController=require("../controller/patient-controller");
const {patientSchema}=require("../validators/patient-validator");
const validate=require("../middlewares/validate-middleware");
const authMiddleware=require("../middlewares/auth-middleware");
router.route("/patient")
  .get(authMiddleware,patientController.patient)
  .post(authMiddleware,validate(patientSchema), patientController.createPatient);
router.get("/profile",authMiddleware,patientController.getPatientProfile);
router.get(
    "/:id",
    authMiddleware,
    patientController.getPatientById
);
module.exports=router;