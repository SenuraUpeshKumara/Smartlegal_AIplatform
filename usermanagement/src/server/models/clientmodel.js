import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  number: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  occupation: {
    type: String,
    required: true,
  },

  NIC: {
    type: String,
    required: true,
    unique: true, // Ensures NIC is unique
  },

  casetype: {
    type: String,
    required: true,
  },

  casetitle: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  opposername: {
    type: String,
    required: true,
  },

  opp_number: {
    type: String,
    required: true,
  },

  agreements: {
    type: [String], // Stores file paths or URLs for uploaded agreements
    required: false,
  },

  other_documents: {
    type: [String], // Stores file paths or URLs for uploaded documents
    required: false,
  },
});

const Client = mongoose.model("Client", ClientSchema);

export { Client };
