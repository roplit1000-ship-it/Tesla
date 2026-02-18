const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');

const router = express.Router();

router.post('/', [
    body('name').trim().notEmpty(),
    body('email').isEmail(),
    body('message').trim().notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { name, email, message } = req.body;
        await pool.query(
            'INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)',
            [name, email, message]
        );
        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
