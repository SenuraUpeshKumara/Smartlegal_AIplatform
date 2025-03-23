import mongoose from "mongoose";

const LegalCaseSchema = new mongoose.Schema({
    
  caseTitle: {
    type: String,
    required: true,
  },

  caseType: {
    type: String,
    required: true,
  },

  caseDescription: {
    type: String,
    required: true,
  },

  //plaintiff
  plaintiff: {
    plaintiffName: {
        type: String,
        required: true,
      }, //store plaintiff's id
    
      plaintiffAddress: [
        {
          homeAddress: String,
          businessAddress: String,
        },
      ],
    
      plaintiffContactNo: {
        type: String,
        required: true,
        unique: true,
        match: [
          /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{3}$/,
          "Invalid contact number format",
        ], // Ensure last part has 3 digits +91 987 654 321
      },
    
      plaintiffEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Invalid email format"],
      },
    
      plaintiffDOB: {
        type: Date,
        required: true,
      },
    
      plaintiffNIC: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{9}[vVxX]?$|^[0-9]{12}$/, // Validates old and new NIC formats
      },
    
      plaintiffEIN: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{2}-\d{7}$/, // EIN format: 2 digits - 7 digits (e.g., 12-3456789)
      },
    
      plaintiffTIN: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{9}$/, // TIN format: 9 digits (e.g., 123456789)
      },
  },
  

  
  //defendant
  defendant: {
    defendantName: {
        type: String,
        required: true,
      }, //store plaintiff's id
    
      defendantAddress: [
        {
          homeAddress: String,
          businessAddress: String,
        },
      ],
    
      defendantContactNo: {
        type: String,
        required: true,
        unique: true,
        match: [
          /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{3}$/,
          "Invalid contact number format",
        ], // Ensure last part has 3 digits +91 987 654 321
      },
    
      defendantEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Invalid email format"],
      },
    
      defendantDOB: {
        type: Date,
        required: true,
      },
    
      defendantNIC: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{9}[vVxX]?$|^[0-9]{12}$/, // Validates old and new NIC formats
      },
    
      defendantEIN: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{2}-\d{7}$/, // EIN format: 2 digits - 7 digits (e.g., 12-3456789)
      },
    
      defendantTIN: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{9}$/, // TIN format: 9 digits (e.g., 123456789)
      },
    
  },
  
  lawyer: {
    LawyerFullName: {
        type: String,
        required: true,
        trim: true,
      },
    
      lawFirmName: {
        type: String,
        required: true,
        trim: true,
      },
    
      firmAddress: {
        type: String,
        required: true,
        trim: true,
      },
    
      contactInfo: {
        officeAddress: {
          type: String,
          required: true,
          trim: true,
        },
        phoneNo: {
          type: String,
          required: true,
          match: /^[0-9]{10}$/, // Validates a 10-digit phone number
        },
        email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true,
          match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email format
        },
      },
    
      barRegistration: {
        barAssociationID: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },
        dateOfAdmission: {
          type: Date,
          required: true,
        },
      },
    
      representStatus: {
        type: String,
        enum: ["Plaintiff", "Defendant"], // Ensures valid role selection
        required: true,
      },
    
  },
});

const LegalCase = mongoose.model("LegalCase", LegalCaseSchema);

export { LegalCase as LegalCase };
