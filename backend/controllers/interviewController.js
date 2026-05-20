import { query } from '../db/index.js';

export const scheduleInterview = async (req, res) => {
    const { application_id, interviewer_id, interview_date, interview_time } = req.body;
    const recruiter_id = req.user.id;

    try {
        const interviewerCheck = await query(
            "SELECT id FROM users WHERE id = $1 AND role = 'interviewer' AND recruiter_id = $2",
            [interviewer_id, recruiter_id]
        );
        if (interviewerCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Interviewer not found or not assigned to you.' });
        }

        // 1. Create the interview record
        const result = await query(
            'INSERT INTO interviews (application_id, interviewer_id, interview_date, interview_time) VALUES ($1, $2, $3, $4) RETURNING *',
            [application_id, interviewer_id, interview_date, interview_time]
        );

        // 2. Automatically move application status to 'scheduled'
        await query(
            "UPDATE applications SET status = 'scheduled' WHERE id = $1",
            [application_id]
        );

        res.status(201).json({ message: "Interview scheduled and status updated.", interview: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getInterviewerSchedule = async (req, res) => {
    const interviewer_id = req.user.id;

    try {
        const result = await query(
            `SELECT i.*, a.status AS application_status, a.candidate_id, u.name AS candidate_name, u.email AS candidate_email, j.title AS job_title,
                    f.id AS feedback_id, f.comments AS feedback_comments, f.rating AS feedback_rating
             FROM interviews i
             JOIN applications a ON i.application_id = a.id
             JOIN users u ON a.candidate_id = u.id
             JOIN jobs j ON a.job_id = j.id
             LEFT JOIN feedback f ON f.interview_id = i.id
             WHERE i.interviewer_id = $1
             ORDER BY i.interview_date ASC, i.interview_time ASC`,
            [interviewer_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};