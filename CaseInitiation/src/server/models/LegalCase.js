import mongoose from "mongoose";

const LegalCaseSchema = new mongoose.Schema({
  caseStatus: {
    type: String,
    default: "pending",
  },

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

  plaintiff: {
    plaintiffName: { type: String, required: true },
    plaintiffHomeAddress: { type: String, required: true },
    plaintiffBusinessAddress: { type: String, required: true },
    plaintiffContactNo: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Example: Validate phone number format (e.g., 10 digits)
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },
    plaintiffEmail: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Validate email format using regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    plaintiffDOB: { type: Date, required: true },
    plaintiffNIC: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Example: Validate NIC format (e.g., 9 digits followed by 'V' or 'X')
          return /^\d{9}[VX]$/.test(v.toUpperCase());
        },
        message: (props) => `${props.value} is not a valid NIC!`,
      },
    },
    plaintiffEIN: { type: String, required: true },
    plaintiffTIN: { type: String, required: true },
  },

  defendant: {
    defendantName: { type: String, required: true },
    defendantHomeAddress: { type: String, required: true },
    defendantBusinessAddress: { type: String, required: true },
    defendantContactNo: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Example: Validate phone number format (e.g., 10 digits)
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },
    defendantEmail: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Validate email format using regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    defendantDOB: { type: Date, required: true },
    defendantNIC: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Example: Validate NIC format (e.g., 9 digits followed by 'V' or 'X')
          return /^\d{9}[VX]$/.test(v.toUpperCase());
        },
        message: (props) => `${props.value} is not a valid NIC!`,
      },
    },
    defendantEIN: { type: String, required: true },
    defendantTIN: { type: String, required: true },
  },

  lawyer: {
    LawyerFullName: { type: String, required: true, trim: true },
    lawFirmName: { type: String, required: true, trim: true },
    firmAddress: { type: String, required: true, trim: true },
    contactInfo: {
      officeAddress: { type: String, required: true, trim: true },
      phoneNo: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            // Example: Validate phone number format (e.g., 10 digits)
            return /^\d{10}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid contact number!`,
        },
      },
      email: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            // Validate email format using regex
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: (props) => `${props.value} is not a valid email address!`,
        },
      },
    },

    barRegistration: {
      barAssociationID: { type: String, required: true, trim: true },
      dateOfAdmission: { type: Date, required: true },
    },

    representStatus: {
      type: String,
      enum: ["Plaintiff", "Defendant"],
      required: true,
    },
  },

  evidenceFiles: [
    {
      fileName: { type: String },
      filePath: { type: String },
    },
  ], // Array to store uploaded files
});

const LegalCase = mongoose.model("LegalCase", LegalCaseSchema);

export { LegalCase };