import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { query } from './db/index.js';

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

const createAdmin = async () => {
  try {
    const existing = await query('SELECT * FROM users WHERE role = $1', ['admin']);
    if (existing.rows.length > 0) {
      console.log('Admin account already exists.');
      console.table(existing.rows.map(({ id, name, email, role, status }) => ({ id, name, email, role, status })));
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status',
      [ADMIN_NAME, ADMIN_EMAIL, hashedPassword, 'admin', 'active']
    );

    console.log('Admin account created successfully:');
    console.table(result.rows);
    console.log('Use the email and password above to log in.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin account:', err.message);
    process.exit(1);
  }
};

createAdmin();
