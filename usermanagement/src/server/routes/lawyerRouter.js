import express from "express";
import multer from "multer";
import { Lawyer } from "../models/lawyermodel.js";

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create a new lawyer with file uploads
router.post(
  "/create-lawyer",
  upload.fields([{ name: "expertise" }]), // This can be extended to other fields for document uploads
  async (req, res) => {
    try {
      console.log('Received Body:', req.body);
      console.log('Received Files:', req.files);

      const { fullname, dob, contactNo, email, l_id, homeaddress, businessaddress, description } = req.body;

      if (!fullname || !dob || !contactNo || !email || !l_id || !homeaddress || !businessaddress || !description) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      const expertise = req.files["expertise"] ? req.files["expertise"].map(file => file.path) : [];

      const newLawyer = new Lawyer({
        fullname,
        dob,
        contactNo,
        email,
        l_id,
        homeaddress,
        businessaddress,
        description,
        expertise,
      });

      const savedLawyer = await newLawyer.save();
      res.status(201).json({ success: true, message: "Lawyer created successfully.", data: savedLawyer });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
  }
);

// Get a single lawyer by ID
router.get("/get-lawyer/:id", async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found." });
    }
    res.status(200).json({ success: true, data: lawyer });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
});

// Update a lawyer's details by ID
router.put(
  "/update-lawyer/:id",
  upload.fields([{ name: "expertise" }]), // Expertise documents upload
  async (req, res) => {
    try {
      const updatedData = { ...req.body };

      if (req.files["expertise"]) {
        updatedData.expertise = req.files["expertise"].map(
          (file) => file.path
        );
      }

      const updatedLawyer = await Lawyer.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedLawyer) {
        return res
          .status(404)
          .json({ success: false, message: "Lawyer not found." });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Lawyer updated successfully.",
          data: updatedLawyer,
        });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Internal server error.",
          error: error.message,
        });
    }
  }
);

// Delete a lawyer by ID
router.delete("/delete-lawyer/:id", async (req, res) => {
  try {
    const deletedLawyer = await Lawyer.findByIdAndDelete(req.params.id);
    if (!deletedLawyer) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found." });
    }

    res
      .status(200)
      .json({ success: true, message: "Lawyer deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
  }
});

export { router as lawyerRouter };
