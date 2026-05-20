import { query } from '../../db/index.js';

const seedApplications = async () => {
    try {
        const existing = await query('SELECT COUNT(*) FROM applications');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log('Applications table already has data, skipping...');
            return;
        }

        const jobsResult = await query('SELECT id, recruiter_id FROM jobs LIMIT 5');
        const candidatesResult = await query("SELECT id FROM users WHERE role = 'candidate' LIMIT 5");

        if (jobsResult.rows.length === 0 || candidatesResult.rows.length === 0) {
            console.log('No jobs or candidates found, skipping applications seeding...');
            return;
        }

        const applications = [
            { job_id: jobsResult.rows[0].id, candidate_id: candidatesResult.rows[0].id, resume_url: 'https://resume.example.com/jordan.pdf', status: 'applied' },
            { job_id: jobsResult.rows[0].id, candidate_id: candidatesResult.rows[1].id, resume_url: 'https://resume.example.com/casey.pdf', status: 'applied' },
            { job_id: jobsResult.rows[1].id, candidate_id: candidatesResult.rows[0].id, resume_url: 'https://resume.example.com/jordan.pdf', status: 'shortlisted' },
            { job_id: jobsResult.rows[1].id, candidate_id: candidatesResult.rows[2].id, resume_url: 'https://resume.example.com/morgan.pdf', status: 'applied' },
            { job_id: jobsResult.rows[2].id, candidate_id: candidatesResult.rows[1].id, resume_url: 'https://resume.example.com/casey.pdf', status: 'applied' },
            { job_id: jobsResult.rows[3].id, candidate_id: candidatesResult.rows[2].id, resume_url: 'https://resume.example.com/morgan.pdf', status: 'scheduled' },
            { job_id: jobsResult.rows[4].id, candidate_id: candidatesResult.rows[0].id, resume_url: 'https://resume.example.com/jordan.pdf', status: 'applied' },
        ];

        for (const app of applications) {
            await query(
                'INSERT INTO applications (job_id, candidate_id, resume_url, status) VALUES ($1, $2, $3, $4)',
                [app.job_id, app.candidate_id, app.resume_url, app.status]
            );
        }

        console.log('✅ Applications seeded successfully');
    } catch (err) {
        console.error('Error seeding applications:', err.message);
    }
};

export default seedApplications;