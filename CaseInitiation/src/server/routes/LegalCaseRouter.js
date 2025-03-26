import express from "express";
import { LegalCase } from "../models/LegalCase.js"; // Adjust the import path as needed

const router = express.Router();

router.post("/create-legal-case", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body); // Log the incoming data for debugging

    // Extract data from the request body
    const {
      caseTitle,
      caseType,
      caseDescription,
      plaintiff,
      defendant,
      lawyer,
    } = req.body;

    // Validate required fields (basic validation)
    if (
      !caseTitle ||
      !caseType ||
      !caseDescription ||
      !plaintiff ||
      !defendant ||
      !lawyer
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create a new legal case instance
    const newLegalCase = new LegalCase({
      caseTitle,
      caseType,
      caseDescription,
      plaintiff,
      defendant,
      lawyer,
    });

    // Save the legal case to the database
    const savedCase = await newLegalCase.save();

    // Respond with success message and the saved case
    res.status(201).json({
      success: true,
      message: "Legal case created successfully.",
      data: savedCase,
    });
  } catch (error) {
    // Handle errors (e.g., validation errors, database errors)
    console.error("Error creating legal case:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        details: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export { router as LegalCaseRouter };
