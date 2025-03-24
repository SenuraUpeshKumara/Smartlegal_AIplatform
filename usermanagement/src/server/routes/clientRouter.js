import express from "express";
import { User } from "../models/User.js"; // Import the User model

const router = express.Router();

// CREATE a new client
router.post("/createclient", async (req, res) => {
  try {
    const newClient = new User(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ all clients
router.get("/", async (req, res) => {
  try {
    const clients = await User.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single client by ID
router.get("/:id", async (req, res) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a client by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClient = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedClient) return res.status(404).json({ message: "Client not found" });
    res.status(200).json(updatedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE a client by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedClient = await User.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: "Client not found" });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
