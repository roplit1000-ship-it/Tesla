const express = require('express');
const router = express.Router();

const newsData = require('../data/news.json');

// GET /api/news — returns articles published on or before today (auto-dating system)
router.get('/', (req, res) => {
    const { category } = req.query;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Only show articles whose publishedAt date has arrived
    let articles = newsData.filter(a => a.publishedAt <= today);

    // Optional category filter
    if (category) {
        articles = articles.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    // Sort by date descending (newest first)
    articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

    res.json(articles);
});

router.get('/:id', (req, res) => {
    const article = newsData.find(a => a.id === parseInt(req.params.id));
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
});

module.exports = router;
