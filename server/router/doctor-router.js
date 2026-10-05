const express = require("express");
const router = express.Router();

const doctorController = require("../controller/doctor-controller");
const { doctorSchema } = require("../validators/doctor-validator");
const validate = require("../middlewares/validate-middleware");
const authMiddleware = require("../middlewares/auth-middleware");

// Get all doctors / Create doctor
router
    .route("/doctor")
    .get(doctorController.doctor)
    .post(
        validate(doctorSchema),
        doctorController.createDoctor
    );

// Doctor profile routes
router.get(
    "/doctor/my-profile",
    authMiddleware,
    doctorController.getMyDoctorProfile
);

router.put(
    "/doctor/my-profile",
    authMiddleware,
    doctorController.updateMyDoctorProfile
);

// Get doctor by ID
router.get(
    "/doctor/:id",
    doctorController.getDoctorById
);

module.exports = router;