import express from "express";
import multer from "multer";
import { Client } from "../models/clientmodel.js";

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

// Create a new client with file uploads
router.post(
  "/create-client",
  upload.fields([{ name: "agreements" }, { name: "other_documents" }]),
  async (req, res) => {
    try {
      const {
        name,
        number,
        address,
        occupation,
        NIC,
        casetype,
        casetitle,
        description,
        opposername,
        opp_number,
      } = req.body;

      if (
        !name ||
        !number ||
        !address ||
        !occupation ||
        !NIC ||
        !casetype ||
        !casetitle ||
        !description ||
        !opposername ||
        !opp_number
      ) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }

      const agreements = req.files["agreements"]
        ? req.files["agreements"].map((file) => file.path)
        : [];
      const otherDocuments = req.files["other_documents"]
        ? req.files["other_documents"].map((file) => file.path)
        : [];

      const newClient = new Client({
        name,
        number,
        address,
        occupation,
        NIC,
        casetype,
        casetitle,
        description,
        opposername,
        opp_number,
        agreements,
        other_documents: otherDocuments,
      });

      const savedClient = await newClient.save();
      res.status(201).json({ success: true, message: "Client created successfully.", data: savedClient });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
  }
);

// Get a single client by ID
router.get("/get-client/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
});

// Update a client's details by ID
router.put(
  "/update-client/:id",
  upload.fields([{ name: "agreements" }, { name: "other_documents" }]),
  async (req, res) => {
    try {
      const updatedData = { ...req.body };

      if (req.files["agreements"]) {
        updatedData.agreements = req.files["agreements"].map((file) => file.path);
      }
      if (req.files["other_documents"]) {
        updatedData.other_documents = req.files["other_documents"].map((file) => file.path);
      }

      const updatedClient = await Client.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!updatedClient) {
        return res.status(404).json({ success: false, message: "Client not found." });
      }

      res.status(200).json({ success: true, message: "Client updated successfully.", data: updatedClient });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
    }
  }
);

// Delete a client by ID
router.delete("/delete-client/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    res.status(200).json({ success: true, message: "Client deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
});

export { router as clientRouter };
