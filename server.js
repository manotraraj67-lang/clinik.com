// ========================================
// HEALTHCARE CLINIC BACKEND
// ========================================


// ========================================
// IMPORT PACKAGES
// ========================================

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");


// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();


// ========================================
// PORT
// ========================================

const PORT = 5000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());


// ========================================
// SERVE FRONTEND
// ========================================

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ========================================
// MONGODB CONNECTION
// ========================================

const MONGO_URI =
    "mongodb://127.0.0.1:27017/healthcare_clinic";


mongoose
    .connect(MONGO_URI)
    .then(() => {

        console.log("✅ MongoDB connected");

    })
    .catch((error) => {

        console.error(
            "❌ MongoDB connection failed:",
            error.message
        );

    });


// ========================================
// APPOINTMENT MODEL
// ========================================

const appointmentSchema =
    new mongoose.Schema(

        {

            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            service: {
                type: String,
                required: true
            },

            date: {
                type: String,
                required: true
            },

            createdAt: {
                type: Date,
                default: Date.now
            }

        },

        {
            collection: "appointments"
        }

    );


const Appointment =
    mongoose.model(
        "Appointment",
        appointmentSchema
    );


// ========================================
// HOME / TEST ROUTE
// ========================================

app.get("/api", (req, res) => {

    res.json({

        message:
            "Healthcare Clinic API is working!"

    });

});


// ========================================
// CREATE APPOINTMENT
// ========================================

app.post(
    "/api/appointments",
    async (req, res) => {

        try {

            const {
                name,
                phone,
                service,
                date
            } = req.body;


            // Validation
            if (
                !name ||
                !phone ||
                !service ||
                !date
            ) {

                return res.status(400).json({

                    message:
                        "All fields are required."

                });

            }


            // Create appointment
            const appointment =
                new Appointment({

                    name: name,

                    phone: phone,

                    service: service,

                    date: date

                });


            // Save to MongoDB
            const savedAppointment =
                await appointment.save();


            console.log(
                "✅ Appointment saved:",
                savedAppointment._id
            );


            res.status(201).json({

                success: true,

                message:
                    "Appointment booked successfully.",

                appointment:
                    savedAppointment

            });


        } catch (error) {

            console.error(
                "❌ Appointment error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Server error while booking appointment."

            });

        }

    }
);


// ========================================
// GET ALL APPOINTMENTS
// ========================================

app.get(
    "/api/appointments",
    async (req, res) => {

        try {

            const appointments =
                await Appointment
                    .find()
                    .sort({
                        createdAt: -1
                    });


            res.json(appointments);


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:
                    "Unable to get appointments."

            });

        }

    }
);


// ========================================
// DELETE APPOINTMENT
// ========================================

app.delete(
    "/api/appointments/:id",
    async (req, res) => {

        try {

            await Appointment.findByIdAndDelete(
                req.params.id
            );


            res.json({

                success: true,

                message:
                    "Appointment deleted successfully."

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                message:
                    "Unable to delete appointment."

            });

        }

    }
);


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    () => {

        console.log(
            `✅ Server running at http://localhost:${PORT}`
        );

    }
);