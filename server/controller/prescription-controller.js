const Prescription=require("../models/prescription-model");
const Appointment=require("../models/appointment-model");
const Doctor=require("../models/doctor-model");
const PDFDocument=require("pdfkit");
const createPrescription=async(req,res)=>{
    try{
        const {
            appointmentId,
            diagnosis,
            medicines,
            tests,
            advice,
            followUpDate,
        }=req.body;
        if(!appointmentId){
            return res.status(400).json({
                msg:"Appointment is required"
            })
        }
        const appointment=await Appointment.findById(
            appointmentId
        );
        if(!appointment){
            return res.status(400).json({
                msg:"Appointment not found"
            });
        }
        const doctor=await Doctor.findOne({
            userId:req.userID,
        });
        if(!doctor){
            return res.status(400).json({
                msg:"Doctor profile not found"
            })
        }
        if(
            appointment.doctorId.toString() !== doctor._id.toString()
        ){
            return res.status(400).json({
                msg:"You are not authorized for this appointment"
            })
        }
        const prescription=await Prescription.create({
            patientId:appointment.patientId,
            doctorId:doctor._id,
            appointmentId:appointment._id,
            diagnosis,
            medicines,
            tests,
            advice,
            followUpDate,
        });
        res.status(200).json({
            msg:"Prescription created successfully",
            data:prescription
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            msg:"Internal server error",
        });
    }
}
const getDoctorPrescriptions=async(req,res)=>{
    try{
    const doctor=await Doctor.findOne({
        userId: req.userID,
    })
    if(!doctor){
        return res.status(404).json({
            msg:"Doctor Profile not found"
        });
    }
    const prescriptions=await Prescription.find({
        doctorId:doctor._id,
    })
    .populate("patientId","username email phone")
    .populate("appointmentId")
    .sort({createdAt:-1});
    res.status(200).json({
        msg:"Prescriptions fetched successfully",
        data:prescriptions,
    });
    }catch(error){
      console.log(error);
      res.status(500).json({
        msg:"Internal server error",
      });
    }
}
const getMyPrescriptions=async(req,res)=>{
    try{
        const prescriptions=await Prescription.find({
           patientId:req.userID,
        })
         .populate({
            path:"doctorId",
            populate:{
                path:"userId",
                select:"username email phone"
            }
         })
         .sort({createdAt:-1});
         res.status(200).json({
            msg:"Prescription fetched successfully",
            data:prescriptions,
         });
    }catch(error){
         console.log(error);
         res.status(500).json({
            msg:"Imternal server error",
         })
    }
}
const downloadPrescriptionPDF = async (req, res) => {
    try {
        const { id } = req.params;

        const prescription = await Prescription.findOne({
            _id: id,
            patientId: req.userID
        })
            .populate("patientId", "name email")
            .populate("doctorId");

        if (!prescription) {
            return res.status(404).json({
                message: "Prescription not found"
            });
        }

        const PDFDocument = require("pdfkit");

        const doc = new PDFDocument({
            size: "A4",
            margin: 40
        });

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Prescription-${prescription._id}.pdf`
        );

        doc.pipe(res);

        /* =========================
           HOSPITAL HEADER
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(20)
            .text("HopeWell City Hospital", {
                align: "center"
            });

        doc
            .font("Helvetica")
            .fontSize(10)
            .text("Kolkata, West Bengal, India", {
                align: "center"
            });

        doc
            .fontSize(9)
            .text(
                "Phone: +91 9876543210  |  support@hopewehospital.com",
                {
                    align: "center"
                }
            );

        doc
            .fontSize(9)
            .text("Mon–Sat: 9 AM–8 PM", {
                align: "center"
            });

        doc.moveDown(0.5);

        doc
            .moveTo(40, doc.y)
            .lineTo(555, doc.y)
            .stroke();

        doc.moveDown(0.8);

        /* =========================
           TITLE
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(18)
            .text("PRESCRIPTION", {
                align: "center"
            });

        doc.moveDown(1);

        /* =========================
           PATIENT + DOCTOR DETAILS
        ========================= */

        const patient = prescription.patientId;
        const doctor = prescription.doctorId;

        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("PATIENT DETAILS");

        doc.moveDown(0.3);

        doc
            .font("Helvetica")
            .fontSize(9)
            .text(`Name: ${prescription.patientName || patient?.name || "-"}`);

        doc
            .text(`Age: ${prescription.patientAge || "-"}`);

        doc
            .text(`Gender: ${prescription.patientGender || "-"}`);

        doc.moveDown(0.7);

        doc
            .font("Helvetica-Bold")
            .text("DOCTOR DETAILS");

        doc.moveDown(0.3);

        doc
            .font("Helvetica")
            .text(
                `Doctor: ${doctor?.name || prescription.doctorName || "-"}`
            );

        doc.text(
            `Specialization: ${doctor?.specialization || "-"}`
        );

        doc.text(
            `Qualification: ${doctor?.qualification || "-"}`
        );

        doc.moveDown(0.7);

        /* =========================
           DIAGNOSIS
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("DIAGNOSIS");

        doc.moveDown(0.3);

        doc
            .font("Helvetica")
            .fontSize(9)
            .text(prescription.diagnosis || "-");

        doc.moveDown(0.8);

        /* =========================
           MEDICINES
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .text("MEDICINES");

        doc.moveDown(0.4);

        const tableX = 40;
        const tableWidth = 515;
        const headerHeight = 25;

        let currentY = doc.y;

        /* TABLE HEADER */

        doc
            .rect(tableX, currentY, tableWidth, headerHeight)
            .fillAndStroke("#eeeeee", "#999999");

        doc
            .fillColor("#000000")
            .font("Helvetica-Bold")
            .fontSize(8);

        doc.text("MEDICINE", 55, currentY + 8);
        doc.text("DOSAGE", 270, currentY + 8);
        doc.text("FREQUENCY", 350, currentY + 8);
        doc.text("DURATION", 455, currentY + 8);

        currentY += headerHeight;

        /* MEDICINE ROWS */

        const medicines = prescription.medicines || [];

        medicines.forEach((medicine, index) => {

            const medicineName =
                typeof medicine === "string"
                    ? medicine
                    : medicine.name || "Medicine";

            const dosage =
                typeof medicine === "object"
                    ? medicine.dosage || "-"
                    : "-";

            const frequency =
                typeof medicine === "object"
                    ? medicine.frequency || "-"
                    : "-";

            const duration =
                typeof medicine === "object"
                    ? medicine.duration || "-"
                    : "-";

            /* ⭐ TIMINGS */

            const timings =
                typeof medicine === "object"
                    ? Array.isArray(medicine.timings)
                        ? medicine.timings.join(", ") || "-"
                        : medicine.timings || "-"
                    : "-";

            /* ⭐ Increased row height */
            const rowHeight = 42;

            doc
                .rect(
                    tableX,
                    currentY,
                    tableWidth,
                    rowHeight
                )
                .stroke("#cccccc");

            /* Medicine name */

            doc
                .font("Helvetica")
                .fontSize(8)
                .fillColor("#000000")
                .text(
                    `${index + 1}. ${medicineName}`,
                    55,
                    currentY + 10,
                    {
                        width: 200
                    }
                );

            /* Dosage */

            doc
                .fontSize(8)
                .text(
                    dosage,
                    270,
                    currentY + 10,
                    {
                        width: 65
                    }
                );

            /* Frequency */

            doc
                .font("Helvetica-Bold")
                .fontSize(8)
                .text(
                    frequency,
                    350,
                    currentY + 7,
                    {
                        width: 90
                    }
                );

            /* ⭐ Timing below frequency */

            doc
                .font("Helvetica")
                .fontSize(7)
                .text(
                    `Timing: ${timings}`,
                    350,
                    currentY + 20,
                    {
                        width: 90
                    }
                );

            /* Duration */

            doc
                .font("Helvetica")
                .fontSize(8)
                .text(
                    duration,
                    455,
                    currentY + 10,
                    {
                        width: 80
                    }
                );

            currentY += rowHeight;
        });

        /* TABLE OUTER BORDER */

        doc
            .rect(
                tableX,
                doc.y,
                tableWidth,
                headerHeight + medicines.length * 42
            )
            .stroke("#999999");

        doc.y = currentY + 15;

        /* =========================
           TESTS
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("RECOMMENDED TESTS");

        doc.moveDown(0.3);

        doc
            .font("Helvetica")
            .fontSize(9)
            .text(prescription.tests || "-");

        doc.moveDown(0.8);

        /* =========================
           ADVICE
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("ADVICE");

        doc.moveDown(0.3);

        doc
            .font("Helvetica")
            .fontSize(9)
            .text(prescription.advice || "-");

        doc.moveDown(0.8);

        /* =========================
           FOLLOW UP
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text("FOLLOW-UP");

        doc.moveDown(0.3);

        doc
            .font("Helvetica")
            .fontSize(9)
            .text(
                prescription.followUpDate
                    ? new Date(
                          prescription.followUpDate
                      ).toLocaleDateString("en-IN")
                    : "-"
            );

        doc.moveDown(2);

        /* =========================
           SIGNATURE
        ========================= */

        doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                "Doctor's Signature",
                400,
                doc.y
            );

        doc.moveDown(2);

        doc
            .moveTo(400, doc.y)
            .lineTo(530, doc.y)
            .stroke();

        doc
            .font("Helvetica")
            .fontSize(8)
            .text(
                doctor?.name || prescription.doctorName || "Doctor",
                400,
                doc.y + 5,
                {
                    width: 130,
                    align: "center"
                }
            );

        /* =========================
           FOOTER
        ========================= */

        doc
            .font("Helvetica")
            .fontSize(8)
            .text(
                "This prescription is digitally generated by HopeWell City Hospital.",
                40,
                790,
                {
                    width: 515,
                    align: "center"
                }
            );

        doc.end();

    } catch (error) {

        console.error(
            "Download prescription PDF error:",
            error
        );

        if (!res.headersSent) {
            res.status(500).json({
                message: "Failed to generate prescription PDF"
            });
        }
    }
};
module.exports={
    createPrescription,
    getDoctorPrescriptions,
    getMyPrescriptions,
    downloadPrescriptionPDF,
};