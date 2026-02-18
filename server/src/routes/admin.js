const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function loadUsers() {
    try {
        if (fs.existsSync(USERS_FILE)) {
            return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
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

// ── Admin authentication middleware ──
function requireAdmin(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const users = loadUsers();
        const user = users.find(u => u.id === decoded.id);

        if (!user || !user.isAdmin) {
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
router.get('/users', requireAdmin, (req, res) => {
    const users = loadUsers();
    const safeUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        displayName: u.displayName,
        createdAt: u.createdAt,
        balance: u.balance || 0,
        profitPercent: u.profitPercent || 0,
        isAdmin: u.isAdmin || false,
    }));
    res.json(safeUsers);
});

// PUT /api/admin/users/:id — update user balance and profitPercent
router.put('/users/:id', requireAdmin, (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { balance, profitPercent, displayName } = req.body;

    let users = loadUsers();
    const idx = users.findIndex(u => u.id === userId);

    if (idx === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
    if (balance !== undefined) users[idx].balance = parseFloat(balance);
    if (profitPercent !== undefined) users[idx].profitPercent = parseFloat(profitPercent);
    if (displayName !== undefined) users[idx].displayName = displayName;

    saveUsers(users);

    res.json({
        id: users[idx].id,
        email: users[idx].email,
        displayName: users[idx].displayName,
        balance: users[idx].balance || 0,
        profitPercent: users[idx].profitPercent || 0,
        isAdmin: users[idx].isAdmin || false,
    });
});

module.exports = router;
