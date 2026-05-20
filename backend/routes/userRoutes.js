import express from 'express';
import { getAllRecruiters, toggleRecruiterStatus, createInterviewer, getInterviewers, deleteInterviewer } from '../controllers/userController.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Routes
router.get('/recruiters', verifyToken, authorizeRole(['admin']), getAllRecruiters);
router.put('/recruiters/:id/toggle-status', verifyToken, authorizeRole(['admin']), toggleRecruiterStatus);

// Recruiter managing Interviewers
router.post('/create-interviewer', verifyToken, authorizeRole(['recruiter']), createInterviewer);
router.get('/interviewers', verifyToken, authorizeRole(['recruiter']), getInterviewers);
router.delete('/interviewers/:id', verifyToken, authorizeRole(['recruiter']), deleteInterviewer);

export default router;