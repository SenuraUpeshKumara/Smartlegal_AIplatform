import express from "express";
import { Case } from '../models/CaseRegister.js';

const router = express.Router();

// Create Product Type with Multiple Products
router.post("/add-case", async (req, res) => {
    try {
        const { caseType, cases } = req.body;

        if (!caseType || !Array.isArray(cases) || cases.length === 0) {
            return res.status(400).json({
                message: "Invalid data format. 'caseType' must be a string and 'cases' must be a non-empty array.",
            });
        }

        // Ensure each product object contains both productName and unitPrice
        const formattedCases = cases.map((Case) => {
            if (!Case.caseTitle) {
                throw new Error("Each case must have 'caseTitle' (string)");
            }
            return {
                caseTitle: Case.caseTitle,
                
            };
        });

        const newCase = new Case({ caseType, cases: formattedCases });
        await newCase.save();

        res.status(201).json({ message: "cases added successfully", data: newCase });
    } catch (error) {
        console.error("Error adding cases:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Route to get all cases with their titles
router.get("/get-all-cases", async (req, res) => {
    try {
        const allCases = await Case.find(); // Fetch all cases from the database
        if (allCases.length === 0) {
            return res.status(404).json({ message: "No cases found." });
        }

        // Prepare the response with case types and case titles
        const caseData = allCases.map((caseItem) => {
            return {
                caseType: caseItem.caseType,
                caseTitles: caseItem.cases.map((caseDetail) => caseDetail.caseTitle),
            };
        });

        res.status(200).json({
            message: "Cases fetched successfully",
            data: caseData,
        });
    } catch (error) {
        console.error("Error fetching all cases:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

// Route to get cases by case type
// Route to get case type by case title
router.get("/get-case-type-by-title/:caseTitle", async (req, res) => {
    try {
        const { caseTitle } = req.params;

        // Find the case where one of the case titles matches the provided caseTitle
        const caseData = await Case.findOne({ "cases.caseTitle": caseTitle });

        if (!caseData) {
            return res.status(404).json({
                message: `No case type found for case title: ${caseTitle}`,
            });
        }

        // Extract the case type and case titles for the response
        const caseType = caseData.caseType;
      

        res.status(200).json({
            message: `Case type for case title '${caseTitle}' fetched successfully`,
            caseType: caseType,
          
        });
    } catch (error) {
        console.error("Error fetching case type by title:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});



// Update case route
// router.put("/update-case", async (req, res) => {
//     try {
//         const { caseType, caseTitle, newCaseTitle } = req.body;

//         if (!caseType || !caseTitle || !newCaseTitle) {
//             return res.status(400).json({
//                 message: "Invalid data. 'caseType', 'caseTitle', and 'newCaseTitle' are required.",
//             });
//         }

//         // Find the case by caseTitle and update the caseTitle
//         const updatedCase = await Case.findOneAndUpdate(
//             { "cases.caseTitle": caseTitle, caseType: caseType }, // Match the case by caseTitle and caseType
//             { $set: { "cases.$.caseTitle": newCaseTitle } }, // Update the caseTitle
//             { new: true } // Return the updated document
//         );

//         if (!updatedCase) {
//             return res.status(404).json({
//                 message: "Case not found with the provided caseTitle.",
//             });
//         }

//         res.status(200).json({
//             message: "Case updated successfully",
//             data: updatedCase
//         });
//     } catch (error) {
//         console.error("Error updating case:", error);
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// });


// Route to delete a case type
router.delete("/delete-case-type/:caseType", async (req, res) => {
    try {
        const { caseType } = req.params;

        // Find the case type and delete it
        const deletedCaseType = await Case.findOneAndDelete({ caseType });

        if (!deletedCaseType) {
            return res.status(404).json({
                message: `No case type found with the name: ${caseType}`,
            });
        }

        res.status(200).json({
            message: `Case type '${caseType}' and its associated cases have been deleted successfully.`,
            data: deletedCaseType,
        });
    } catch (error) {
        console.error("Error deleting case type:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

export { router as CaseRegisterRouter };
