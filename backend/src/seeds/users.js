import { query } from '../../db/index.js';
import bcrypt from 'bcryptjs';

const seedUsers = async () => {
    try {
        const existing = await query('SELECT COUNT(*) FROM users');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log('Users table already has data, skipping...');
            return;
        }

        const hashedPassword = async (p) => bcrypt.hash(p, 10);

        const users = [
            { name: 'Admin User', email: 'admin@example.com', password: 'Admin123!', role: 'admin', status: 'active', company_name: null },
            { name: 'Sarah Johnson', email: 'sarah@techcorp.com', password: 'Pass123!', role: 'recruiter', status: 'active', company_name: 'TechCorp Inc.' },
            { name: 'Mike Chen', email: 'mike@startup.io', password: 'Pass123!', role: 'recruiter', status: 'active', company_name: 'Startup.io' },
            { name: 'Emily Davis', email: 'emily@bigcorp.com', password: 'Pass123!', role: 'recruiter', status: 'pending', company_name: 'BigCorp Ltd.' },
            { name: 'Tom Wilson', email: 'tom@techcorp.com', password: 'Pass123!', role: 'interviewer', status: 'active', company_name: null },
            { name: 'Lisa Brown', email: 'lisa@techcorp.com', password: 'Pass123!', role: 'interviewer', status: 'active', company_name: null },
            { name: 'Alex Kim', email: 'alex@startup.io', password: 'Pass123!', role: 'interviewer', status: 'active', company_name: null },
            { name: 'Jordan Smith', email: 'jordan@example.com', password: 'Pass123!', role: 'candidate', status: 'active', company_name: null },
            { name: 'Casey Miller', email: 'casey@example.com', password: 'Pass123!', role: 'candidate', status: 'active', company_name: null },
            { name: 'Morgan Taylor', email: 'morgan@example.com', password: 'Pass123!', role: 'candidate', status: 'active', company_name: null },
        ];

        for (const user of users) {
            const hash = await hashedPassword(user.password);
            await query(
                'INSERT INTO users (name, email, password, role, status, company_name) VALUES ($1, $2, $3, $4, $5, $6)',
                [user.name, user.email, hash, user.role, user.status, user.company_name]
            );
        }

        const recruiterResult = await query("SELECT id FROM users WHERE role = 'recruiter' AND status = 'active' LIMIT 2");
        const recruiters = recruiterResult.rows;



        console.log('✅ Users seeded successfully');
    } catch (err) {
        console.error('Error seeding users:', err.message);
    }
};

export default seedUsers;