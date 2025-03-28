import express from "express";
import multer from "multer";
import { Client } from "../models/clientmodel.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure the "uploads" directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});

const upload = multer({ storage });

// Create a new client with file uploads
router.post(
  "/create-client",
  upload.fields([{ name: "agreements" }, { name: "other_documents" }]),
  async (req, res) => {
    try {
      console.log("Received Body:", req.body);
      console.log("Received Files:", req.files);

      const { fullname, contactNo, email, dob, homeaddress, businessaddress, description } = req.body;

      if (!fullname || !contactNo || !email || !dob || !homeaddress || !businessaddress || !description) {
        return res.status(400).json({
          success: false,
          message: "All fields except file uploads are required.",
        });
      }

      // Check if the client already exists
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "Client with this email already exists.",
        });
      }

      const agreements = req.files["agreements"] ? req.files["agreements"].map((file) => file.path) : [];
      const otherDocuments = req.files["other_documents"] ? req.files["other_documents"].map((file) => file.path) : [];

      const newClient = new Client({
        fullname,
        contactNo,
        email,
        dob,
        homeaddress,
        businessaddress,
        description,
        agreements,
        other_documents: otherDocuments,
      });

      const savedClient = await newClient.save();

      res.status(201).json({
        success: true,
        message: "Client created successfully.",
        data: savedClient,
      });
    } catch (error) {
      console.error("Error creating client:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  }
);

// Get a single client by ID
router.get("/get-client/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }
    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    console.error("Error fetching client:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

// Update a client's details by ID
router.put(
  "/update-client/:id",
  upload.fields([{ name: "agreements" }, { name: "other_documents" }]),
  async (req, res) => {
    try {
      const updatedData = { ...req.body };

      // Handle file updates for agreements
      if (req.files["agreements"]) {
        updatedData.agreements = req.files["agreements"].map(
          (file) => file.path
        );
      }

      // Handle file updates for other documents
      if (req.files["other_documents"]) {
        updatedData.other_documents = req.files["other_documents"].map(
          (file) => file.path
        );
      }

      // Update the client in the database
      const updatedClient = await Client.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true, // Return the updated document
          runValidators: true, // Validate against the schema
        }
      );

      if (!updatedClient) {
        return res.status(404).json({
          success: false,
          message: "Client not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Client updated successfully.",
        data: updatedClient,
      });
    } catch (error) {
      console.error("Error updating client:", error.message);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message,
      });
    }
  }
);

// Delete a client by ID
router.delete("/delete-client/:id", async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting client:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

// Check if a client exists by email
// Check if a client exists by email
router.post("/check-client-exists", async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required.",
    });
  }

  try {
    // Check if the email exists in the client table
    const clientExists = await Client.findOne({ email });

    if (clientExists) {
      return res.json({
        success: true,
        exists: true,
        client: clientExists, // Return the full client data
      });
    }

    return res.json({
      success: true,
      exists: false,
    });
  } catch (error) {
    console.error("Error checking client existence:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

export { router as clientRouter };
