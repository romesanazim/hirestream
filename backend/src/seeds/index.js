import seedUsers from './users.js';
import seedJobs from './jobs.js';
import seedApplications from './applications.js';
import seedInterviews from './interviews.js';
import seedFeedback from './feedback.js';

const runAllSeeds = async () => {
    console.log('Starting database seeding...\n');
    await seedUsers();
    await seedJobs();
    await seedApplications();
    await seedInterviews();
    await seedFeedback();
    console.log('\n🎉 All seeds completed!');
};

runAllSeeds();