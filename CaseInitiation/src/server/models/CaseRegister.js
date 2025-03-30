import mongoose from 'mongoose';

const CaseSchema = new mongoose.Schema({

    caseType: {
        type: String,
        required: true,
    },

    cases: [
        {
            caseTitle: {
                type: String, 
                required: true 
            },

        }
    ]
});

const CaseModel = mongoose.model('Case', CaseSchema);

export { CaseModel as Case };
