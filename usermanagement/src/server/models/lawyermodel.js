import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  l_id: {
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
  
  expertise: {
    type: [String], // Stores file paths for uploaded certificates or licenses
    required: false,
  },
 
  
});

const Lawyer = mongoose.model("Lawyer", LawyerSchema);
export { Lawyer };
