import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Phone number must be exactly 10 digits"],
  },
  consultationType: {
    type: String,
    required: true,
    enum: ["Legal Advice", "Case Evaluation", "Document Review", "Other"],
  },
  remark: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Consultation = mongoose.model("Consultation", ConsultationSchema);

export { Consultation }; // Ensure this export matches the import in `consultationRouter.js`