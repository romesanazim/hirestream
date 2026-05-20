import { query } from '../db/index.js';

export const submitFeedback = async (req, res) => {
    const { interview_id, comments, rating } = req.body;

    try {
        const result = await query(
            'INSERT INTO feedback (interview_id, comments, rating) VALUES ($1, $2, $3) RETURNING *',
            [interview_id, comments, rating]
        );

        await query(
            `UPDATE applications 
             SET status = 'interviewed' 
             WHERE id = (SELECT application_id FROM interviews WHERE id = $1)`,
            [interview_id]
        );

        res.status(201).json({ message: "Feedback submitted successfully", feedback: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getApplicationFeedback = async (req, res) => {
    const { application_id } = req.params;

    try {
        const result = await query(
            `SELECT f.*, u.name as interviewer_name 
             FROM feedback f
             JOIN interviews i ON f.interview_id = i.id
             JOIN users u ON i.interviewer_id = u.id
             WHERE i.application_id = $1`,
            [application_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllFeedback = async (req, res) => {
    const { application_id } = req.params;

    try {
        const result = await query(
            `SELECT f.*, u.name as interviewer_name 
             FROM feedback f
             JOIN interviews i ON f.interview_id = i.id
             JOIN users u ON i.interviewer_id = u.id
             WHERE i.application_id = $1`,
            [application_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};