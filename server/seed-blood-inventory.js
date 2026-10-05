require("dotenv").config();

const mongoose = require("mongoose");
const connectDb = require("./utils/db");
const BloodInventory = require("./models/BloodInventory");

const bloodInventory = [
    {
        bloodGroup: "A+",
        unitsAvailable: 8,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "A-",
        unitsAvailable: 3,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "B+",
        unitsAvailable: 12,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "B-",
        unitsAvailable: 4,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "AB+",
        unitsAvailable: 5,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "AB-",
        unitsAvailable: 2,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "O+",
        unitsAvailable: 15,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    },
    {
        bloodGroup: "O-",
        unitsAvailable: 3,
        hospital: "HopeWell City Hospital",
        location: "Kolkata, West Bengal"
    }
];

const seedBloodInventory = async () => {
    try {
        await connectDb();

        await BloodInventory.deleteMany();

        await BloodInventory.insertMany(bloodInventory);

        console.log("Blood inventory added successfully");

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding blood inventory:", error);
    }
};

seedBloodInventory();