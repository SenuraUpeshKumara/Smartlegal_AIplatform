import express from "express";
import mongoose from "mongoose"; 
import { Consultation } from "../models/consultationSchema.js";

const router = express.Router();

// Create a new consultation request
router.post("/create-consultation", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, consultationType, remark } = req.body;

    if (!fullName || !email || !phoneNumber || !consultationType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newConsultation = new Consultation({
      fullName,
      email,
      phoneNumber,
      consultationType,
      remark,
    });

    const savedConsultation = await newConsultation.save();

    return res.status(201).json({
      message: "Consultation created successfully",
      consultationId: savedConsultation._id.toString(),
    });
  } catch (error) {
    console.error("Error creating consultation:", error);

    // Always send a JSON response
    return res.status(500).json({
      message: "Internal server error",
      error: error.message, // Include error message for debugging
    });
  }
});

// Get all consultations
router.get("/all", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, consultations });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/get/:id", async (req, res) => {
  try {
    // Validate ObjectID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid consultation ID" });
    }

    // Fetch consultation by ID
    const consultation = await Consultation.findById(req.params.id);

    // Handle not found case
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }

    // Return success response
    res.json({
      success: true,
      consultation: consultation.toObject(), // Convert Mongoose document to plain object
    });
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Delete a consultation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedConsultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!deletedConsultation) {
      return res.status(404).json({ success: false, message: "Consultation not found" });
    }
    return res.status(200).json({ success: true, message: "Consultation deleted successfully" });
  } catch (error) {
    console.error("Error deleting consultation:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { router as ConsultationRouter };
