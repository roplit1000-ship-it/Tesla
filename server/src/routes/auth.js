const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const { sendVerificationCode } = require('../services/email');

const router = express.Router();

// ── Persistent user store (JSON file) ──
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const data = fs.readFileSync(USERS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error loading users:', err);
    }
    return [];
}

function saveUsers(users) {
    try {
        const dir = path.dirname(USERS_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving users:', err);
    }
}

let users = loadUsers();
let nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function userResponse(user) {
    return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
        balance: user.balance || 0,
        profitPercent: user.profitPercent || 0,
        isAdmin: user.isAdmin || false,
    };
}

// ── Register ──
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('displayName').trim().notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password, displayName } = req.body;

        // Reload users to avoid stale data
        users = loadUsers();
        nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

        if (users.find(u => u.email === email)) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        const code = generateCode();
        const user = {
            id: nextId++,
            email,
            passwordHash: hash,
            displayName,
            createdAt: new Date().toISOString(),
            balance: 0,
            profitPercent: 0,
            isAdmin: false,
            verified: false,
            verificationCode: code,
            codeExpiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        };
        users.push(user);
        saveUsers(users);

        // Send verification email
        try {
            await sendVerificationCode(email, code, displayName);
        } catch (emailErr) {
            console.error('Email send failed:', emailErr);
            // Still create the account, user can resend
        }

        res.status(201).json({
            requiresVerification: true,
            email: user.email,
            message: 'Verification code sent to your email',
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Verify Email ──
router.post('/verify-email', [
    body('email').isEmail(),
    body('code').isLength({ min: 6, max: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, code } = req.body;

        users = loadUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (user.verified) {
            return res.status(400).json({ error: 'Email is already verified' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        if (new Date(user.codeExpiry) < new Date()) {
            return res.status(400).json({ error: 'Code has expired. Please request a new one.' });
        }

        // Mark as verified
        user.verified = true;
        delete user.verificationCode;
        delete user.codeExpiry;
        saveUsers(users);

        // Issue JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: userResponse(user),
        });
    } catch (err) {
        console.error('Verify error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Resend Code ──
router.post('/resend-code', [
    body('email').isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email } = req.body;

        users = loadUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (user.verified) {
            return res.status(400).json({ error: 'Email is already verified' });
        }

        const code = generateCode();
        user.verificationCode = code;
        user.codeExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
        saveUsers(users);

        await sendVerificationCode(email, code, user.displayName);

        res.json({ message: 'New code sent to your email' });
    } catch (err) {
        console.error('Resend code error:', err);
        res.status(500).json({ error: 'Failed to resend code' });
    }
});

// ── Login ──
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;

        users = loadUsers();
        const user = users.find(u => u.email === email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        // Check if verified
        if (user.verified === false) {
            return res.status(403).json({
                error: 'Please verify your email first',
                requiresVerification: true,
                email: user.email,
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: userResponse(user),
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ── Get current user profile (auth required) ──
router.get('/me', require('../middleware/auth'), (req, res) => {
    users = loadUsers();
    const user = users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
        user: userResponse(user),
    });
});

module.exports = router;
