const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require("../controller/appointment-controller");
const authMiddleware = require("../middlewares/auth-middleware");
router
  .route("/appointment")
  .post(authMiddleware, createAppointment)
  .get(authMiddleware, getAppointments);
router.get(
  "/doctor-appointments",
  authMiddleware,
  getDoctorAppointments
);
router.put(
  "/:id",
  authMiddleware,
  updateAppointmentStatus
);
module.exports = router;