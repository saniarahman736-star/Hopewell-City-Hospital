const Appointment = require("../models/appointment-model");
const Doctor = require("../models/doctor-model");
const createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      status,
    } = req.body;

    const appointment = await Appointment.create({
      patientId: req.userID,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      status,
    });

    res.status(200).json({
      msg: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.userID,
    }).populate({
      path: "doctorId",
      populate: {
        path: "userId",
        select: "username",
      },
    });

    if (appointments.length === 0) {
      return res.status(404).json({
        msg: "No Appointments found",
      });
    }

    res.status(200).json({
      msg: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};


// GET DOCTOR APPOINTMENTS
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      userId: req.userID,
    });

    if (!doctor) {
      return res.status(400).json({
        msg: "Doctor profile not found",
      });
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    }).populate(
      "patientId",
      "username email phone"
    );

    if (appointments.length === 0) {
      return res.status(400).json({
        msg: "No appointments found",
      });
    }

    res.status(200).json({
      msg: "Doctor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};


// UPDATE APPOINTMENT STATUS
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(
      req.params.id
    );

    if (!appointment) {
      return res.status(404).json({
        msg: "Appointment not found",
      });
    }

    const doctor = await Doctor.findOne({
      userId: req.userID,
    });

    if (!doctor) {
      return res.status(404).json({
        msg: "Doctor profile not found",
      });
    }

    // Make sure this appointment belongs to this doctor
    if (
      appointment.doctorId.toString() !==
      doctor._id.toString()
    ) {
      return res.status(403).json({
        msg: "You are not authorized to update this appointment",
      });
    }

    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      msg: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Internal server error",
    });
  }
};


module.exports = {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};