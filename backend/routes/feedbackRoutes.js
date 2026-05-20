import express from 'express';
import { submitFeedback, getApplicationFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/submit', verifyToken, authorizeRole(['interviewer']), submitFeedback);

router.get('/:application_id', verifyToken, authorizeRole(['recruiter', 'admin']), getApplicationFeedback);

export default router;