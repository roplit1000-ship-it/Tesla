const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// ── Admin authentication middleware ──
async function requireAdmin(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        const user = result.rows[0];

        if (!user || !user.is_admin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        req.userId = decoded.id;
        req.adminUser = user;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// GET /api/admin/users — list all users
router.get('/users', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, display_name, created_at, balance, profit_percent, is_admin FROM users ORDER BY id'
        );
        const users = result.rows.map(u => ({
            id: u.id,
            email: u.email,
            displayName: u.display_name,
            createdAt: u.created_at,
            balance: parseFloat(u.balance) || 0,
            profitPercent: parseFloat(u.profit_percent) || 0,
            isAdmin: u.is_admin || false,
        }));
        res.json(users);
    } catch (err) {
        console.error('Admin users error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/users/:id — update user balance and profitPercent
router.put('/users/:id', requireAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10);
        const { balance, profitPercent, displayName } = req.body;

        const updates = [];
        const values = [];
        let idx = 1;

        if (balance !== undefined) { updates.push(`balance = $${idx++}`); values.push(parseFloat(balance)); }
        if (profitPercent !== undefined) { updates.push(`profit_percent = $${idx++}`); values.push(parseFloat(profitPercent)); }
        if (displayName !== undefined) { updates.push(`display_name = $${idx++}`); values.push(displayName); }

        if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, email, display_name, balance, profit_percent, is_admin`;

        const result = await pool.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        const u = result.rows[0];
        res.json({
            id: u.id,
            email: u.email,
            displayName: u.display_name,
            balance: parseFloat(u.balance) || 0,
            profitPercent: parseFloat(u.profit_percent) || 0,
            isAdmin: u.is_admin || false,
        });
    } catch (err) {
        console.error('Admin update error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
