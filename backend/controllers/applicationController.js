import { query } from '../db/index.js';

export const applyForJob = async (req, res) => {
    const { job_id, resume_url } = req.body;
    const candidate_id = req.user.id;

    if (!resume_url) {
        return res.status(400).json({ error: 'Resume upload is required to apply.' });
    }

    try {
        const result = await query(
            'INSERT INTO applications (job_id, candidate_id, resume_url, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [job_id, candidate_id, resume_url, 'applied']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "You have already applied for this job." });
    }
};

export const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['applied', 'shortlisted', 'scheduled', 'interviewed', 'selected', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status update." });
    }

    try {
        const result = await query(
            'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        res.json({ message: `Application status updated to ${status}`, application: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getApplications = async (req, res) => {
    const { status, job_id } = req.query;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    try {
        let sql = `
            SELECT a.*, j.title as job_title, u.name as candidate_name, u.email as candidate_email
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN users u ON a.candidate_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (requesterRole === 'recruiter') {
            params.push(requesterId);
            sql += ` AND j.recruiter_id = $${params.length}`;
        }

        if (status) {
            params.push(status);
            sql += ` AND a.status = $${params.length}`;
        }
        if (job_id) {
            params.push(job_id);
            sql += ` AND a.job_id = $${params.length}`;
        }

        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMyApplications = async (req, res) => {
    const candidate_id = req.user.id;
    try {
        const result = await query(
            `SELECT a.*, j.title as job_title, j.location, j.department,
                    i.interview_date, i.interview_time
             FROM applications a
             JOIN jobs j ON a.job_id = j.id
             LEFT JOIN LATERAL (
                 SELECT interview_date, interview_time
                 FROM interviews
                 WHERE application_id = a.id
                 ORDER BY interview_date ASC, interview_time ASC
                 LIMIT 1
             ) i ON true
             WHERE a.candidate_id = $1`,
            [candidate_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};