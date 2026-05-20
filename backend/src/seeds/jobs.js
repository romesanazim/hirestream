import { query } from '../../db/index.js';

const seedJobs = async () => {
    try {
        const existing = await query('SELECT COUNT(*) FROM jobs');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log('Jobs table already has data, skipping...');
            return;
        }

        const recruiterResult = await query("SELECT id FROM users WHERE role = 'recruiter' AND status = 'active' LIMIT 2");
        if (recruiterResult.rows.length === 0) {
            console.log('No recruiters found, skipping jobs seeding...');
            return;
        }

        const jobs = [
            {
                title: 'Senior Frontend Developer',
                description: 'We are looking for an experienced frontend developer to join our team.',
                location: 'Remote',
                required_skills: 'React, JavaScript, TypeScript, CSS',
                skills: 'React, JavaScript, TypeScript',
                recruiter_id: recruiterResult.rows[0].id,
                department: 'Engineering',
                deadline: '2026-06-15'
            },
            {
                title: 'Backend Engineer',
                description: 'Join us to build scalable backend services.',
                location: 'New York, NY',
                required_skills: 'Node.js, PostgreSQL, AWS',
                skills: 'Node.js, PostgreSQL, AWS',
                recruiter_id: recruiterResult.rows[0].id,
                department: 'Engineering',
                deadline: '2026-06-20'
            },
            {
                title: 'Product Manager',
                description: 'Lead product development and strategy.',
                location: 'San Francisco, CA',
                required_skills: 'Product Management, Agile, Jira',
                skills: 'Product Management, Agile',
                recruiter_id: recruiterResult.rows[0].id,
                department: 'Product',
                deadline: '2026-06-25'
            },
            {
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend features.',
                location: 'Remote',
                required_skills: 'React, Node.js, MongoDB',
                skills: 'React, Node.js, MongoDB',
                recruiter_id: recruiterResult.rows[1]?.id || recruiterResult.rows[0].id,
                department: 'Engineering',
                deadline: '2026-07-01'
            },
            {
                title: 'UI/UX Designer',
                description: 'Design beautiful and user-friendly interfaces.',
                location: 'Austin, TX',
                required_skills: 'Figma, Adobe XD, Prototyping',
                skills: 'Figma, Adobe XD',
                recruiter_id: recruiterResult.rows[1]?.id || recruiterResult.rows[0].id,
                department: 'Design',
                deadline: '2026-07-10'
            },
        ];

        for (const job of jobs) {
            await query(
                'INSERT INTO jobs (title, description, location, required_skills, skills, recruiter_id, department, deadline) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                [job.title, job.description, job.location, job.required_skills, job.skills, job.recruiter_id, job.department, job.deadline]
            );
        }

        console.log('✅ Jobs seeded successfully');
    } catch (err) {
        console.error('Error seeding jobs:', err.message);
    }
};

export default seedJobs;