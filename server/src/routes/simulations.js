const express = require('express');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ── Simple in-memory simulation store ──
const simulations = [];
let nextSimId = 1;

// Get saved simulations (auth required)
router.get('/', authMiddleware, (req, res) => {
    const userSims = simulations
        .filter(s => s.user_id === req.userId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json(userSims);
});

// Save a simulation (auth required)
router.post('/', authMiddleware, [
    body('tier').trim().notEmpty(),
    body('deposit').isNumeric(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { tier, deposit, projectedGrowth, notes } = req.body;
    const sim = {
        id: nextSimId++,
        user_id: req.userId,
        tier,
        deposit,
        projected_growth: projectedGrowth || null,
        notes: notes || null,
        created_at: new Date().toISOString(),
    };
    simulations.push(sim);
    res.status(201).json(sim);
});

module.exports = router;
