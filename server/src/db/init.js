const pool = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * Auto-initialize the database on server startup.
 * Creates tables if they don't exist and seeds the admin account.
 */
async function initDB() {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                display_name VARCHAR(100) NOT NULL DEFAULT '',
                balance DECIMAL(12, 2) DEFAULT 0,
                profit_percent DECIMAL(6, 2) DEFAULT 0,
                is_admin BOOLEAN DEFAULT false,
                verified BOOLEAN DEFAULT false,
                verification_code VARCHAR(6),
                code_expiry TIMESTAMPTZ,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `);

        // Seed admin if not exists
        const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@resla.com']);
        if (adminCheck.rows.length === 0) {
            const hash = await bcrypt.hash('password', 10);
            await pool.query(
                `INSERT INTO users (email, password_hash, display_name, is_admin, verified)
                 VALUES ($1, $2, $3, true, true)`,
                ['admin@resla.com', hash, 'Admin']
            );
            console.log('Admin account seeded: admin@resla.com');
        }

        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Database init error:', err);
        throw err;
    }
}

module.exports = initDB;
