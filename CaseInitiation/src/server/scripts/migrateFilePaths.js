import mongoose from "mongoose";
import path from "path";
import { LegalCase } from "../models/LegalCase.js"; // Adjust the import path as needed

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch all legal cases
    const cases = await LegalCase.find({});

    // Define the base path to remove
    const basePath = path.join(__dirname, "../");

    // Update each case's evidenceFiles
    for (const legalCase of cases) {
      legalCase.evidenceFiles = legalCase.evidenceFiles.map((file) => ({
        ...file,
        filePath: file.filePath.replace(basePath, ""), // Convert to relative path
      }));

      // Save the updated case
      await legalCase.save();
    }

    console.log("Migration complete!");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.disconnect();
  }
})();