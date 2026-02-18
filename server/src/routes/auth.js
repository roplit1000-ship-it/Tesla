const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

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

// Register
router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('displayName').trim().notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password, displayName } = req.body;

        // Check if email is already taken
        if (users.find(u => u.email === email)) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = {
            id: nextId++,
            email,
            passwordHash: hash,
            displayName,
            createdAt: new Date().toISOString(),
            balance: 0,
            profitPercent: 0,
            isAdmin: false,
        };
        users.push(user);
        saveUsers(users);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt, balance: user.balance || 0, profitPercent: user.profitPercent || 0, isAdmin: user.isAdmin || false },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt, balance: user.balance || 0, profitPercent: user.profitPercent || 0, isAdmin: user.isAdmin || false },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user profile (auth required)
router.get('/me', require('../middleware/auth'), (req, res) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
        user: { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt, balance: user.balance || 0, profitPercent: user.profitPercent || 0, isAdmin: user.isAdmin || false },
    });
});

module.exports = router;
