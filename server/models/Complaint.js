const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the complaint'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description of the event']
    },
    location: {
        type: String,
        required: [true, 'Please specify the exact location (e.g., Booth number, Area)']
    },
    type: {
        type: String,
        required: [true, 'Please specify the type of malpractice'],
        enum: [
            'bribery', 
            'booth_capturing', 
            'fake_voting', 
            'voter_intimidation', 
            'other',
            'custom'
        ]
    },
    evidence: {
        type: String, // Will store the file URL (Cloudinary or local upload path)
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending' // Admin will change this later
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true // Links the complaint to the user who filed it
    },
    // --- AI Integration Hooks (Prepared for future implementation) ---
    aiClassification: {
        type: String,
        // Will be used to store predicted Category / Severity by the ML model
        default: null 
    },
    aiConfidenceScore: {
        type: Number,
        // E.g., 0.95 reflecting 95% confidence in AI's classification
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
