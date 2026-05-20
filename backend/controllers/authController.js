import { query } from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, email, password, role, company_name } = req.body;
    try {
        // 1. Block Interviewer self-registration
        if (role === 'interviewer') {
            return res.status(403).json({ message: "Interviewers cannot self-register. A recruiter must create your account." });
        }

        // 2. Block Admin creation via public API
        if (role === 'admin') {
            return res.status(403).json({ message: "Unauthorized role selection." });
        }

        // 3. Require company_name for recruiters
        if (role === 'recruiter' && !company_name) {
            return res.status(400).json({ message: "Company name is required for recruiters." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 4. Set status: Recruiters are 'pending', Candidates are 'active'
        const status = (role === 'recruiter') ? 'pending' : 'active';

        const result = await query(
            'INSERT INTO users (name, email, password, role, status, company_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, status, company_name',
            [name, email, hashedPassword, role, status, role === 'recruiter' ? company_name : null]
        );

        const message = (role === 'recruiter') 
            ? "Registration successful. Please wait for Admin approval." 
            : "Registration successful. You can login now.";

        res.status(201).json({ message, user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Email already exists or Database error." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = result.rows[0];

        // 4. Check if account is approved and not frozen
        if (user.status === 'pending') {
            return res.status(403).json({ message: "Your account is pending Admin approval." });
        }
        if (user.status === 'frozen') {
            return res.status(403).json({ message: "Your account has been frozen. Contact Admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};