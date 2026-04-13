const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    const { title, description, location, type } = req.body;

    try {
        // If image/video is uploaded via multer, its path is stored here
        const evidence = req.file ? `/uploads/${req.file.filename}` : null;

        const complaint = await Complaint.create({
            title,
            description,
            location,
            type,
            user: req.user._id,
            evidence
        });

        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admins see all, Users only see their own)
const getComplaints = async (req, res) => {
    try {
        let query = {};
        
        // Scope restrictions for normal users
        if (req.user.role !== 'admin') {
            query.user = req.user._id;
        }

        // Populate attached user data 
        const complaints = await Complaint.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 }); // Newest first

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status (Verify/Reject)
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin Only
const updateComplaintStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        const updatedComplaint = await complaint.save();

        res.json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    updateComplaintStatus
};
