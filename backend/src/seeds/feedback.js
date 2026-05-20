import { query } from '../../db/index.js';

const seedFeedback = async () => {
    try {
        const existing = await query('SELECT COUNT(*) FROM feedback');
        if (parseInt(existing.rows[0].count) > 0) {
            console.log('Feedback table already has data, skipping...');
            return;
        }

        const interviewsResult = await query('SELECT id FROM interviews LIMIT 5');

        if (interviewsResult.rows.length === 0) {
            console.log('No interviews found, skipping feedback seeding...');
            return;
        }

        const feedbackList = [
            { interview_id: interviewsResult.rows[0].id, comments: 'Excellent problem-solving skills. Strong communication.', rating: 5 },
            { interview_id: interviewsResult.rows[1]?.id, comments: 'Good technical knowledge but needs to work on system design.', rating: 4 },
            { interview_id: interviewsResult.rows[2]?.id, comments: 'Average performance. Consider for junior role.', rating: 3 },
        ];

        for (const fb of feedbackList) {
            if (!fb.interview_id) continue;
            await query(
                'INSERT INTO feedback (interview_id, comments, rating) VALUES ($1, $2, $3)',
                [fb.interview_id, fb.comments, fb.rating]
            );
        }

        console.log('✅ Feedback seeded successfully');
    } catch (err) {
        console.error('Error seeding feedback:', err.message);
    }
};

export default seedFeedback;