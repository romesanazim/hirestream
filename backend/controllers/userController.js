import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';

// ADMIN ONLY: View all recruiters
export const getAllRecruiters = async (req, res) => {
    try {
        const result = await query("SELECT id, name, email, role, status, company_name FROM users WHERE role = 'recruiter'");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const toggleRecruiterStatus = async (req, res) => {
    const { id } = req.params;
    try {
        // Get current status
        const current = await query("SELECT status FROM users WHERE id = $1 AND role = 'recruiter'", [id]);
        if (current.rows.length === 0) return res.status(404).json({ message: "Recruiter not found" });

        const newStatus = current.rows[0].status === 'active' ? 'frozen' : 'active';
        await query("UPDATE users SET status = $1 WHERE id = $2", [newStatus, id]);
        res.json({ message: `Recruiter status updated to ${newStatus}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// RECRUITER ONLY: Create Interviewer accounts
export const createInterviewer = async (req, res) => {
    const { name, email, password } = req.body;
    const recruiter_id = req.user.id;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await query(
            "INSERT INTO users (name, email, password, role, status, recruiter_id) VALUES ($1, $2, $3, 'interviewer', 'active', $4) RETURNING id, name, email",
            [name, email, hashedPassword, recruiter_id]
        );
        res.status(201).json({ message: "Interviewer account created.", interviewer: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Interviewer email already exists." });
    }
};

export const getInterviewers = async (req, res) => {
    const recruiter_id = req.user.id;
    try {
        const result = await query("SELECT id, name, email, status FROM users WHERE role = 'interviewer' AND recruiter_id = $1", [recruiter_id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteInterviewer = async (req, res) => {
    const { id } = req.params;
    const recruiter_id = req.user.id;
    try {
        const result = await query("DELETE FROM users WHERE id = $1 AND role = 'interviewer' AND recruiter_id = $2 RETURNING id", [id, recruiter_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: "Interviewer not found or unauthorized" });
        res.json({ message: "Interviewer deleted successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};