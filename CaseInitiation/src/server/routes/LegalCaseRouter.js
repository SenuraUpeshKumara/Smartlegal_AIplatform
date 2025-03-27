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

// Serve static files (optional, for testing purposes)
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.post(
  "/create-legal-case",
  upload.array("evidenceFiles"), // Handle multiple files
  async (req, res) => {
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

// Get Legal Case by ID Route
router.get("/get-legal-case/:id", async (req, res) => {
  try {
    const caseId = req.params.id;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, message: "Invalid case ID" });
    }

    // Fetch the case from the database
    const caseData = await LegalCase.findById(caseId);

    if (!caseData) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    // Return the case data
    res.json({ success: true, case: caseData });
  } catch (error) {
    console.error("Error fetching case details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export { router as LegalCaseRouter };