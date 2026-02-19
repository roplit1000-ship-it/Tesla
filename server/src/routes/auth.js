const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { sendVerificationCode } = require('../services/email');

const router = express.Router();

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function userResponse(user) {
    return {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        createdAt: user.created_at,
        balance: parseFloat(user.balance) || 0,
        profitPercent: parseFloat(user.profit_percent) || 0,
        isAdmin: user.is_admin || false,
    };
}

// ── Register ──
router.post('/register', [
    body('email').trim().toLowerCase().isEmail(),
    body('password').isLength({ min: 6 }),
    body('displayName').trim().notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password, displayName } = req.body;

        const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        const code = generateCode();
        const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            `INSERT INTO users (email, password_hash, display_name, verification_code, code_expiry)
             VALUES ($1, $2, $3, $4, $5)`,
            [email, hash, displayName, code, codeExpiry]
        );

        try {
            await sendVerificationCode(email, code, displayName);
        } catch (emailErr) {
            console.error('Email send failed:', emailErr);
        }

        res.status(201).json({
            requiresVerification: true,
            email,
            message: 'Verification code sent to your email',
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Verify Email ──
router.post('/verify-email', [
    body('email').trim().toLowerCase().isEmail(),
    body('code').isLength({ min: 6, max: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, code } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ error: 'Account not found' });
        if (user.verified) return res.status(400).json({ error: 'Email is already verified' });
        if (user.verification_code !== code) return res.status(400).json({ error: 'Invalid verification code' });
        if (new Date(user.code_expiry) < new Date()) return res.status(400).json({ error: 'Code has expired. Please request a new one.' });

        await pool.query(
            'UPDATE users SET verified = true, verification_code = NULL, code_expiry = NULL WHERE id = $1',
            [user.id]
        );

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        user.verified = true;
        res.json({ token, user: userResponse(user) });
    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Resend Code ──
router.post('/resend-code', [
    body('email').trim().toLowerCase().isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ error: 'Account not found' });
        if (user.verified) return res.status(400).json({ error: 'Email is already verified' });

        const code = generateCode();
        const codeExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await pool.query(
            'UPDATE users SET verification_code = $1, code_expiry = $2 WHERE id = $3',
            [code, codeExpiry, user.id]
        );

        await sendVerificationCode(email, code, user.display_name);
        res.json({ message: 'New code sent to your email' });
    } catch (err) {
        console.error('Resend code error:', err);
        res.status(500).json({ error: 'Failed to resend code' });
    }
});

// ── Login ──
router.post('/login', [
    body('email').trim().toLowerCase().isEmail(),
    body('password').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        if (!user.verified) {
            return res.status(403).json({
                error: 'Please verify your email first',
                requiresVerification: true,
                email: user.email,
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: userResponse(user) });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Get current user profile ──
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: userResponse(user) });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
