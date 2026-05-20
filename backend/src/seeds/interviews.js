import { query } from '../../db/index.js';

const seedInterviews = async () => {
    try {
        const existing = await query('SELECT COUNT(*) FROM interviews');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log('Interviews table already has data, skipping...');
            return;
        }

        const applicationsResult = await query("SELECT id FROM applications WHERE status = 'scheduled' LIMIT 3");
        const interviewersResult = await query("SELECT id FROM users WHERE role = 'interviewer' LIMIT 3");

        if (applicationsResult.rows.length === 0 || interviewersResult.rows.length === 0) {
            console.log('No scheduled applications or interviewers found, skipping interviews seeding...');
            return;
        }

        const interviews = [
            { application_id: applicationsResult.rows[0].id, interviewer_id: interviewersResult.rows[0].id, interview_date: '2026-05-25', interview_time: '10:00' },
            { application_id: applicationsResult.rows[1]?.id, interviewer_id: interviewersResult.rows[1]?.id || interviewersResult.rows[0].id, interview_date: '2026-05-26', interview_time: '14:00' },
            { application_id: applicationsResult.rows[2]?.id, interviewer_id: interviewersResult.rows[2]?.id || interviewersResult.rows[0].id, interview_date: '2026-05-27', interview_time: '11:30' },
        ];

        for (const interview of interviews) {
            if (!interview.application_id) continue;
            await query(
                'INSERT INTO interviews (application_id, interviewer_id, interview_date, interview_time) VALUES ($1, $2, $3, $4)',
                [interview.application_id, interview.interviewer_id, interview.interview_date, interview.interview_time]
            );
        }

        console.log('✅ Interviews seeded successfully');
    } catch (err) {
        console.error('Error seeding interviews:', err.message);
    }
};

export default seedInterviews;