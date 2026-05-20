import { query } from '../../db/index.js';

const clearAll = async () => {
    try {
        console.log('Clearing all tables...');
        await query('DELETE FROM feedback');
        await query('DELETE FROM interviews');
        await query('DELETE FROM applications');
        await query('DELETE FROM jobs');
        await query('DELETE FROM users');
        console.log('✅ All tables cleared');
    } catch (err) {
        console.error('Error clearing tables:', err.message);
    }
};

clearAll();