import { query } from '../db/index.js';

// Create Job (Including Department and Deadline)
export const createJob = async (req, res) => {
    const { title, description, location, required_skills, department, deadline } = req.body;
    const recruiter_id = req.user.id;

    const insertQuery = 'INSERT INTO jobs (title, description, location, required_skills, recruiter_id, department, deadline) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const insertValues = [title, description, location, required_skills, recruiter_id, department, deadline || null];

    try {
        const result = await query(insertQuery, insertValues);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.message.includes('column "description"') || err.message.includes('column description')) {
            try {
                const fallbackResult = await query(
                    'INSERT INTO jobs (title, discription, location, required_skills, recruiter_id, department, deadline) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                    insertValues
                );
                res.status(201).json(fallbackResult.rows[0]);
                return;
            } catch (fallbackErr) {
                res.status(500).json({ error: fallbackErr.message });
                return;
            }
        }

        res.status(500).json({ error: err.message });
    }
};

// Update Job (Including Deadline)
export const updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description, location, required_skills, department, deadline } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const buildUpdate = (descriptionColumn) => {
        const baseSql = `UPDATE jobs 
             SET title = $1, ${descriptionColumn} = $2, location = $3, required_skills = $4, department = $5, deadline = $6 
             WHERE id = $7`;
        return role === 'recruiter'
            ? `${baseSql} AND recruiter_id = $8 RETURNING *`
            : `${baseSql} RETURNING *`;
    };

    const updateValues = [title, description, location, required_skills, department, deadline || null, id];
    if (role === 'recruiter') updateValues.push(userId);

    try {
        const updateQuery = buildUpdate('description');
        const result = await query(updateQuery, updateValues);
        if (!result.rows.length) {
            return res.status(403).json({ message: 'Job not found or you are not authorized to edit this job.' });
        }
        res.json({ message: "Job updated successfully", job: result.rows[0] });
    } catch (err) {
        if (err.message.includes('column "description"') || err.message.includes('column description')) {
            try {
                const fallbackQuery = buildUpdate('discription');
                const fallbackResult = await query(fallbackQuery, updateValues);
                if (!fallbackResult.rows.length) {
                    return res.status(403).json({ message: 'Job not found or you are not authorized to edit this job.' });
                }
                res.json({ message: "Job updated successfully", job: fallbackResult.rows[0] });
                return;
            } catch (fallbackErr) {
                res.status(500).json({ error: fallbackErr.message });
                return;
            }
        }

        res.status(500).json({ error: err.message });
    }
};

// Delete Job
export const deleteJob = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    try {
        let result;
        if (role === 'recruiter') {
            result = await query("DELETE FROM jobs WHERE id = $1 AND recruiter_id = $2 RETURNING *", [id, userId]);
        } else {
            result = await query("DELETE FROM jobs WHERE id = $1 RETURNING *", [id]);
        }

        if (!result.rows.length) {
            return res.status(404).json({ message: 'Job not found or you are not authorized to delete this job.' });
        }
        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllJobs = async (req, res) => {
    const { search, location } = req.query;
    const params = [];

    const buildSql = (descriptionColumn) => {
        let sql = `SELECT j.*, ${descriptionColumn} AS description, u.name as recruiter_name, u.company_name 
                   FROM jobs j 
                   JOIN users u ON j.recruiter_id = u.id 
                   WHERE 1=1`;

        if (search) {
            params.push(`%${search}%`);
            sql += ` AND (j.title ILIKE $${params.length} OR j.required_skills ILIKE $${params.length} OR j.skills ILIKE $${params.length} OR j.description ILIKE $${params.length})`;
        }

        if (location) {
            params.push(`%${location}%`);
            sql += ` AND j.location ILIKE $${params.length}`;
        }

        return sql;
    };

    try {
        const sql = buildSql('j.description');
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        if (err.message.includes('j.description') || err.message.includes('column "description"') || err.message.includes('column description')) {
            try {
                const fallbackSql = buildSql('j.discription');
                const fallbackResult = await query(fallbackSql, params);
                res.json(fallbackResult.rows);
                return;
            } catch (fallbackErr) {
                res.status(500).json({ error: fallbackErr.message });
                return;
            }
        }

        res.status(500).json({ error: err.message });
    }
};

export const getRecruiterJobs = async (req, res) => {
    const { search, location } = req.query;
    const recruiterId = req.user.id;
    const params = [recruiterId];

    const buildSql = (descriptionColumn) => {
        let sql = `SELECT j.*, ${descriptionColumn} AS description, u.name as recruiter_name, u.company_name 
                   FROM jobs j 
                   JOIN users u ON j.recruiter_id = u.id 
                   WHERE j.recruiter_id = $1`;

        if (search) {
            params.push(`%${search}%`);
            sql += ` AND (j.title ILIKE $${params.length} OR j.required_skills ILIKE $${params.length} OR j.skills ILIKE $${params.length} OR j.description ILIKE $${params.length})`;
        }

        if (location) {
            params.push(`%${location}%`);
            sql += ` AND j.location ILIKE $${params.length}`;
        }

        return sql;
    };

    try {
        const sql = buildSql('j.description');
        const result = await query(sql, params);
        res.json(result.rows);
    } catch (err) {
        if (err.message.includes('j.description') || err.message.includes('column "description"') || err.message.includes('column description')) {
            try {
                const fallbackSql = buildSql('j.discription');
                const fallbackResult = await query(fallbackSql, params);
                res.json(fallbackResult.rows);
                return;
            } catch (fallbackErr) {
                res.status(500).json({ error: fallbackErr.message });
                return;
            }
        }

        res.status(500).json({ error: err.message });
    }
};

// Ensure 'export' is here!
export const getDashboardStats = async (req, res) => {
    try {
        const role = req.user.role;
        const userId = req.user.id;

        const interviewJoin = role === 'recruiter'
            ? 'JOIN applications a ON i.application_id = a.id JOIN jobs j ON a.job_id = j.id AND j.recruiter_id = $1'
            : 'JOIN applications a ON i.application_id = a.id JOIN jobs j ON a.job_id = j.id';

        const stats = await query(`
            SELECT 
                (SELECT COUNT(*) FROM applications a JOIN jobs j ON a.job_id = j.id ${role === 'recruiter' ? 'AND j.recruiter_id = $1' : ''} WHERE a.status = 'applied') as applied_count,
                (SELECT COUNT(*) FROM applications a JOIN jobs j ON a.job_id = j.id ${role === 'recruiter' ? 'AND j.recruiter_id = $1' : ''} WHERE a.status = 'shortlisted') as shortlisted_count,
                (SELECT COUNT(*) FROM applications a JOIN jobs j ON a.job_id = j.id ${role === 'recruiter' ? 'AND j.recruiter_id = $1' : ''} WHERE a.status = 'scheduled') as scheduled_count,
                (SELECT COUNT(*) FROM applications a JOIN jobs j ON a.job_id = j.id ${role === 'recruiter' ? 'AND j.recruiter_id = $1' : ''} WHERE a.status = 'selected') as hired_count,
                (SELECT COUNT(*) FROM interviews i ${interviewJoin} WHERE i.interview_date >= CURRENT_DATE) as upcoming_interviews
        `, role === 'recruiter' ? [userId] : []);
        res.json(stats.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};