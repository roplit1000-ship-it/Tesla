const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ── In-memory purchase store ──
const purchases = [];
let nextId = 1;

// POST /api/purchase — Submit a purchase/deposit application
router.post('/', [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('depositAmount').isNumeric().withMessage('Deposit amount must be a number'),
    body('itemName').trim().notEmpty().withMessage('Item name is required'),
    body('itemType').isIn(['tier', 'product']).withMessage('Item type must be tier or product'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullName, email, phone, depositAmount, message, itemType, itemName, tierSlug, productId } = req.body;

        const purchase = {
            id: nextId++,
            fullName,
            email,
            phone,
            depositAmount: Number(depositAmount),
            message: message || '',
            itemType,
            itemName,
            tierSlug: tierSlug || null,
            productId: productId || null,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        purchases.push(purchase);
        console.log('\n═══════════════════════════════════════');
        console.log('📩 NEW PURCHASE APPLICATION');
        console.log('═══════════════════════════════════════');
        console.log(`Type:    ${itemType === 'tier' ? '📊 Tier Deposit' : '🛒 Product Order'}`);
        console.log(`Item:    ${itemName}`);
        console.log(`Name:    ${fullName}`);
        console.log(`Email:   ${email}`);
        console.log(`Phone:   ${phone}`);
        console.log(`Amount:  $${Number(depositAmount).toLocaleString()}`);
        if (message) console.log(`Message: ${message}`);
        console.log('═══════════════════════════════════════\n');

        // ── Telegram notification (will be enabled when bot token is set) ──
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
            const telegramMsg = [
                `${itemType === 'tier' ? '📊' : '🛒'} *New ${itemType === 'tier' ? 'Tier Deposit' : 'Product Order'}*`,
                '',
                `*Item:* ${itemName}`,
                `*Name:* ${fullName}`,
                `*Email:* ${email}`,
                `*Phone:* ${phone}`,
                `*Amount:* $${Number(depositAmount).toLocaleString()}`,
                message ? `*Message:* ${message}` : '',
                '',
                `_${new Date().toLocaleString()}_`,
            ].filter(Boolean).join('\n');

            try {
                const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
                await fetch(telegramUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: telegramMsg,
                        parse_mode: 'Markdown',
                    }),
                });
                console.log('✅ Telegram notification sent');
            } catch (tgErr) {
                console.error('⚠️  Telegram notification failed:', tgErr.message);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            purchase: { id: purchase.id, itemName, status: 'pending' },
        });
    } catch (err) {
        console.error('Purchase error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/purchase — List all purchases (for admin)
router.get('/', (req, res) => {
    res.json(purchases);
});

module.exports = router;
