const express = require('express');
const router = express.Router();

const productsData = require('../data/products.json');

router.get('/', (req, res) => {
    const { category } = req.query;
    let products = productsData;
    if (category) {
        products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    res.json(products);
});

router.get('/:id', (req, res) => {
    const product = productsData.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

module.exports = router;
