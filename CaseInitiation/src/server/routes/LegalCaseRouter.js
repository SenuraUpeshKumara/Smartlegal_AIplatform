import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { LegalCase } from "../models/LegalCase.js"; // Adjust the import path as needed

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/")); // Ensure this folder exists or create it dynamically
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

const router = express.Router();

// Create Legal Case Route
router.post("/create-legal-case", upload.array("evidenceFiles"), async (req, res) => {
  try {
    const {
      caseTitle,
      caseType,
      caseDescription,
      plaintiff,
      defendant,
      lawyer,
    } = req.body;

    // Parse nested JSON fields
    const parsedPlaintiff = JSON.parse(plaintiff);
    const parsedDefendant = JSON.parse(defendant);
    const parsedLawyer = JSON.parse(lawyer);

    // Process uploaded files
    const evidenceFiles =
      req.files?.map((file) => ({
        fileName: file.originalname,
        filePath: file.path.replace(path.join(__dirname, "../"), ""), // Store relative path
      })) || [];

    // Save the legal case to the database
    const newLegalCase = new LegalCase({
      caseTitle,
      caseType,
      caseDescription,
      plaintiff: parsedPlaintiff,
      defendant: parsedDefendant,
      lawyer: parsedLawyer,
      evidenceFiles,
    });

    const savedCase = await newLegalCase.save();

    res.status(201).json({
      success: true,
      message: "Legal case created successfully.",
      data: {
        id: savedCase._id,
        ...savedCase.toObject(),
      },
    });
  } catch (error) {
    console.error("Error creating legal case:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});


// Create Legal Case Route
router.post("/create-legal-case", upload.array("evidenceFiles"), async (req, res) => {
    try {
      const {
        caseTitle,
        caseType,
        caseDescription,
        plaintiff,
        defendant,
        lawyer,
      } = req.body;

      // Parse nested JSON fields
      const parsedPlaintiff = JSON.parse(plaintiff);
      const parsedDefendant = JSON.parse(defendant);
      const parsedLawyer = JSON.parse(lawyer);

      // Process uploaded files
      const evidenceFiles =
        req.files?.map((file) => ({
          fileName: file.originalname,
          filePath: file.path,
        })) || [];

      // Save the legal case to the database
      const newLegalCase = new LegalCase({
        caseTitle,
        caseType,
        caseDescription,
        plaintiff: parsedPlaintiff,
        defendant: parsedDefendant,
        lawyer: parsedLawyer,
        evidenceFiles,
      });

      const savedCase = await newLegalCase.save();

      res.status(201).json({
        success: true,
        message: "Legal case created successfully.",
        data: {
          id: savedCase._id,
          ...savedCase.toObject(),
        },
      });
    } catch (error) {
      console.error("Error creating legal case:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
);

// Get All Legal Cases Route
router.get("/get-all-legal-cases", async (req, res) => {
  try {
    const allCases = await LegalCase.find({}, "caseTitle caseType plaintiff lawyer caseStatus");

    if (!allCases || allCases.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No legal cases found",
      });
    }

    res.json({
      success: true,
      message: "All legal cases retrieved successfully.",
      cases: allCases,
    });
  } catch (error) {
    console.error("Error fetching all legal cases:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get Legal Case by ID Route
router.get("/get-legal-case/:id", async (req, res) => {
  try {
    const caseId = req.params.id;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid case ID" });
    }

    // Fetch the case from the database
    const caseData = await LegalCase.findById(caseId);

    if (!caseData) {
      return res
        .status(404)
        .json({ success: false, message: "Case not found" });
    }

    // Return the case data
    res.json({ success: true, case: caseData });
  } catch (error) {
    console.error("Error fetching case details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update Case Status Route
router.put("/update-case-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { caseStatus } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid case ID" });
    }

    // Ensure caseStatus is either "pending" or "resolved"
    if (!["pending", "resolved"].includes(caseStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid case status. Allowed values: pending, resolved",
      });
    }

    // Update the case status in the database
    const updatedCase = await LegalCase.findByIdAndUpdate(
      id,
      { caseStatus },
      { new: true } // Return the updated document
    );

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.json({
      success: true,
      message: `Case status updated to '${caseStatus}' successfully.`,
      case: updatedCase,
    });
  } catch (error) {
    console.error("Error updating case status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Add Evidence to Existing Case Route
router.patch("/add-evidence/:id", upload.array("evidenceFiles"), async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid case ID" });
    }

    // Find the case by ID
    const legalCase = await LegalCase.findById(id);

    if (!legalCase) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    // Process uploaded files
    const newEvidenceFiles =
      req.files?.map((file) => ({
        fileName: file.originalname,
        filePath: file.path.replace(path.join(__dirname, "../"), ""), // Store relative path
      })) || [];

    // Append new files to the existing evidenceFiles array
    legalCase.evidenceFiles = [...legalCase.evidenceFiles, ...newEvidenceFiles];

    // Save the updated case
    const updatedCase = await legalCase.save();

    res.status(200).json({
      success: true,
      message: "Evidence added successfully.",
      case: updatedCase,
    });
  } catch (error) {
    console.error("Error adding evidence:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete Legal Case Route
router.delete("/delete-legal-case/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid case ID",
      });
    }

    // Find and delete the case by ID
    const deletedCase = await LegalCase.findByIdAndDelete(id);

    if (!deletedCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.json({
      success: true,
      message: "Case deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting case:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export { router as LegalCaseRouter };
