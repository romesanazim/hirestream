import express from 'express';
import { applyForJob, getApplications, updateApplicationStatus, getMyApplications } from '../controllers/applicationController.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Candidate applies for a job
router.post('/apply', verifyToken, authorizeRole(['candidate']), applyForJob);

// Recruiter views applications for their jobs
router.get('/recruiter', verifyToken, authorizeRole(['recruiter']), getApplications);

// Recruiter/Admin updates status (shortlist, select, reject, etc.)
router.put('/:id/status', verifyToken, authorizeRole(['recruiter', 'admin']), updateApplicationStatus);

router.get('/my-applications', verifyToken, authorizeRole(['candidate']), getMyApplications);

export default router;