import express from 'express';
// Combine everything into ONE import line
import { createJob, getAllJobs, getRecruiterJobs, updateJob, getDashboardStats, deleteJob } from '../controllers/jobController.js';
import { verifyToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route: Anyone can see jobs
router.get('/', getAllJobs);

// Protected route: Recruiter sees only their own jobs
router.get('/recruiter', verifyToken, authorizeRole(['recruiter', 'admin']), getRecruiterJobs);

// Protected route: Only recruiters/admins can post jobs
router.post('/', verifyToken, authorizeRole(['recruiter', 'admin']), createJob);

// Protected route: Dashboard stats
router.get('/stats', verifyToken, authorizeRole(['recruiter', 'admin']), getDashboardStats);

router.put('/:id', verifyToken, authorizeRole(['recruiter', 'admin']), updateJob);
router.delete('/:id', verifyToken, authorizeRole(['recruiter', 'admin']), deleteJob);

export default router;

