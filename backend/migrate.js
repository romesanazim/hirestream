import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function migrate() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to remote database');

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'recruiter', 'interviewer', 'candidate')),
                status VARCHAR(50) DEFAULT 'active',
                company_name VARCHAR(255),
                recruiter_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created users table');

        await client.query(`
            DO $$ BEGIN
                ALTER TABLE users ADD COLUMN IF NOT EXISTS recruiter_id INTEGER REFERENCES users(id);
            EXCEPTION WHEN others THEN NULL;
            END $$;
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                location VARCHAR(255),
                required_skills TEXT,
                skills TEXT,
                recruiter_id INTEGER REFERENCES users(id),
                department VARCHAR(255),
                deadline DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created jobs table');

        await client.query(`
            DO $$ BEGIN
                ALTER TABLE jobs ADD COLUMN IF NOT EXISTS discription TEXT;
            EXCEPTION WHEN others THEN NULL;
            END $$;
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS applications (
                id SERIAL PRIMARY KEY,
                job_id INTEGER REFERENCES jobs(id),
                candidate_id INTEGER REFERENCES users(id),
                resume_url TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'applied',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created applications table');

        await client.query(`
            CREATE TABLE IF NOT EXISTS interviews (
                id SERIAL PRIMARY KEY,
                application_id INTEGER REFERENCES applications(id),
                interviewer_id INTEGER REFERENCES users(id),
                interview_date DATE NOT NULL,
                interview_time TIME NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created interviews table');

        await client.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                interview_id INTEGER REFERENCES interviews(id),
                comments TEXT,
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created feedback table');

        console.log('\n✅ All migrations completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err.message);
        throw err;
    } finally {
        await client.end();
    }
}

migrate();