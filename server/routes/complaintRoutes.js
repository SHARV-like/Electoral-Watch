const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus, updateComplaintEvidence } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Base Route: /api/complaints
router.route('/')
    .get(protect, getComplaints)
    .post(protect, upload.single('evidence'), createComplaint); // Inject Mutler directly into endpoint

// Update Status Base: /api/complaints/:id/status
router.route('/:id/status')
    .put(protect, admin, updateComplaintStatus);

// Upload/Replace Evidence: /api/complaints/:id/evidence
router.route('/:id/evidence')
    .put(protect, upload.single('evidence'), updateComplaintEvidence);

module.exports = router;
