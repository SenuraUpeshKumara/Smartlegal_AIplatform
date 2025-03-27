import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  homeaddress: {
    type: String,
    required: true,
  },
  businessaddress: {
    type: String,
    required: true,
  },
  

  description: {
    type: String,
    required: true,
  },
  
  agreements: {
    type: [String], // Stores file paths for uploaded agreements
    required: false,
  },
  other_documents: {
    type: [String], // Stores file paths for uploaded documents
    required: false,
  },
});

const Client = mongoose.model("Client", ClientSchema);
export { Client };