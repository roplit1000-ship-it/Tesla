const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

const router = express.Router();

router.post('/', [body('email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { email } = req.body;
        await pool.query(
            'INSERT INTO subscriptions (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
            [email]
        );
        res.json({ message: 'Subscribed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
