import express from "express";
import multer from "multer";
import { Client } from "../models/clientmodel.js"; // Adjust the import path as needed

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination called for file:", file.originalname); // Log the file being processed
    cb(null, "uploads/"); // Save files in an "uploads" directory
  },
  filename: (req, file, cb) => {
    console.log("Filename set for file:", file.originalname); // Log the filename being set
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Create a new client with file uploads
router.post("/create-client", upload.fields([{ name: "agreements" }, { name: "other_documents" }]), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request body
    console.log("Uploaded files:", req.files); // Log the uploaded files

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

    // Validate required fields
    if (!name || !number || !address || !occupation || !NIC || !casetype || !casetitle || !description || !opposername || !opp_number) {
      console.log("Missing required fields"); // Log if any required field is missing
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const agreements = req.files["agreements"] ? req.files["agreements"].map((file) => file.path) : [];
    const otherDocuments = req.files["other_documents"] ? req.files["other_documents"].map((file) => file.path) : [];

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

    console.log("Client created successfully:", savedClient); // Log the saved client

    res.status(201).json({ success: true, message: "Client created successfully.", data: savedClient });
  } catch (error) {
    console.error("Error creating client:", error); // Log error if occurs
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Get a single client by ID
router.get("/get-client/:id", async (req, res) => {
  try {
    console.log("Fetching client with ID:", req.params.id); // Log the client ID being fetched

    const client = await Client.findById(req.params.id);
    if (!client) {
      console.log("Client not found"); // Log if client is not found
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    console.log("Client fetched successfully:", client); // Log the fetched client data
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    console.error("Error fetching client:", error); // Log error if occurs
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Update a client's details by ID
router.put("/update-client/:id", upload.fields([{ name: "agreements" }, { name: "other_documents" }]), async (req, res) => {
  try {
    console.log("Updating client with ID:", req.params.id); // Log the client ID being updated
    console.log("Request body:", req.body); // Log the incoming request body
    console.log("Uploaded files:", req.files); // Log the uploaded files

    const updatedData = { ...req.body };

    if (req.files["agreements"]) {
      updatedData.agreements = req.files["agreements"].map((file) => file.path);
    }
    if (req.files["other_documents"]) {
      updatedData.other_documents = req.files["other_documents"].map((file) => file.path);
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });

    if (!updatedClient) {
      console.log("Client not found"); // Log if client is not found for updating
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    console.log("Client updated successfully:", updatedClient); // Log the updated client data
    res.status(200).json({ success: true, message: "Client updated successfully.", data: updatedClient });
  } catch (error) {
    console.error("Error updating client:", error); // Log error if occurs
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Delete a client by ID
router.delete("/delete-client/:id", async (req, res) => {
  try {
    console.log("Deleting client with ID:", req.params.id); // Log the client ID being deleted

    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      console.log("Client not found for deletion"); // Log if client is not found for deletion
      return res.status(404).json({ success: false, message: "Client not found." });
    }

    console.log("Client deleted successfully"); // Log when client is deleted
    res.status(200).json({ success: true, message: "Client deleted successfully." });
  } catch (error) {
    console.error("Error deleting client:", error); // Log error if occurs
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

export default router;
