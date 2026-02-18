import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollFadeIn from './ScrollFadeIn';
import './ProductShowcase.css';

const products = [
    {
        id: 'model-s',
        name: 'Model S',
        tagline: 'The flagship sedan',
        category: 'Vehicles',
        image: '/images/products/model-s.png',
        specs: [
            { label: 'Range', value: '405 mi' },
            { label: '0-60 mph', value: '1.99s' },
            { label: 'Top Speed', value: '200 mph' },
            { label: 'Peak Power', value: '1,020 hp' },
        ],
        description: 'The ultimate in electric performance. Model S Plaid delivers the quickest acceleration of any production car ever made.',
        price: 'From $74,990',
        accent: '#3B82F6',
    },
    {
        id: 'model-3',
        name: 'Model 3',
        tagline: 'The people\'s electric car',
        category: 'Vehicles',
        image: '/images/products/model-3.png',
        specs: [
            { label: 'Range', value: '358 mi' },
            { label: '0-60 mph', value: '3.1s' },
            { label: 'Top Speed', value: '162 mph' },
            { label: 'Peak Power', value: '510 hp' },
        ],
        description: 'Redesigned from the ground up, the Highland refresh brings a new interior, improved range, and refined aesthetics.',
        price: 'From $38,990',
        accent: '#E82127',
    },
    {
        id: 'model-x',
        name: 'Model X',
        tagline: 'Performance meets utility',
        category: 'Vehicles',
        image: '/images/products/model-x.png',
        specs: [
            { label: 'Range', value: '348 mi' },
            { label: '0-60 mph', value: '2.5s' },
            { label: 'Seating', value: 'Up to 7' },
            { label: 'Peak Power', value: '1,020 hp' },
        ],
        description: 'The most capable SUV ever built. Falcon Wing doors, unparalleled performance, and room for the whole family.',
        price: 'From $79,990',
        accent: '#8B5CF6',
    },
    {
        id: 'model-y',
        name: 'Model Y',
        tagline: 'Best-selling EV on Earth',
        category: 'Vehicles',
        image: '/images/products/model-y.png',
        specs: [
            { label: 'Range', value: '310 mi' },
            { label: '0-60 mph', value: '3.5s' },
            { label: 'Cargo', value: '76 cu ft' },
            { label: 'Peak Power', value: '456 hp' },
        ],
        description: 'The world\'s best-selling electric vehicle. Versatile, efficient, and built for everyday adventures.',
        price: 'From $44,990',
        accent: '#E82127',
    },
    {
        id: 'cybertruck',
        name: 'Cybertruck',
        tagline: 'Built for any planet',
        category: 'Vehicles',
        image: '/images/products/cybertruck.png',
        specs: [
            { label: 'Range', value: '340 mi' },
            { label: '0-60 mph', value: '2.6s' },
            { label: 'Towing', value: '11,000 lbs' },
            { label: 'Exoskeleton', value: '30X Steel' },
        ],
        description: 'Ultra-hard stainless steel exoskeleton. Nearly impenetrable. Built to be the most durable and versatile truck ever.',
        price: 'From $79,990',
        accent: '#A1A1AA',
    },
    {
        id: 'tesla-phone',
        name: 'Tesla Phone',
        tagline: 'Beyond connectivity',
        category: 'Technology',
        image: '/images/products/tesla-phone.png',
        specs: [
            { label: 'Display', value: '6.7" AMOLED' },
            { label: 'Chip', value: 'Tesla T1' },
            { label: 'Camera', value: '108 MP' },
            { label: 'Battery', value: '5,500 mAh' },
        ],
        description: 'Seamlessly integrated with your Tesla. Control your car, Powerwall, and solar — all from one device. Starlink connectivity built in.',
        price: 'Concept',
        accent: '#E82127',
    },
    {
        id: 'tesla-bot',
        name: 'Optimus',
        tagline: 'A future with robots',
        category: 'Robotics',
        image: '/images/products/tesla-bot.png',
        specs: [
            { label: 'Height', value: '5\'8"' },
            { label: 'Carry', value: '45 lbs' },
            { label: 'Speed', value: '5 mph' },
            { label: 'AI', value: 'FSD Neural Net' },
        ],
        description: 'A general-purpose humanoid robot designed to eliminate dangerous, repetitive, and boring tasks. Powered by Tesla\'s FSD neural network.',
        price: 'Coming 2026',
        accent: '#3B82F6',
    },
];

const categories = ['All', 'Vehicles', 'Technology', 'Robotics'];

export default function ProductShowcase() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filtered = activeCategory === 'All'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <section className="product-showcase">
            <ScrollFadeIn>
                <div className="showcase-header">
                    <h2>The Tesla <span className="gradient-text">Lineup</span></h2>
                    <p>Vehicles, technology, and robotics — explore the full ecosystem.</p>
                </div>
            </ScrollFadeIn>

            <div className="showcase-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`showcase-filter ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="showcase-grid">
                <AnimatePresence mode="popLayout">
                    {filtered.map((product, i) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="showcase-card"
                            onClick={() => setSelectedProduct(product)}
                            style={{ '--accent': product.accent }}
                        >
                            <div className="showcase-card-img">
                                <img src={product.image} alt={product.name} loading="lazy" />
                            </div>
                            <div className="showcase-card-body">
                                <span className="showcase-category">{product.category}</span>
                                <h3>{product.name}</h3>
                                <p className="showcase-tagline">{product.tagline}</p>
                                <div className="showcase-card-footer">
                                    <span className="showcase-price">{product.price}</span>
                                    <span className="showcase-cta">Explore →</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* ── Detail Modal ── */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div
                        className="showcase-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProduct(null)}
                    >
                        <motion.div
                            className="showcase-detail"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 40, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                            style={{ '--accent': selectedProduct.accent }}
                        >
                            <button className="showcase-close" onClick={() => setSelectedProduct(null)}>✕</button>
                            <div className="showcase-detail-grid">
                                <div className="showcase-detail-img">
                                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                                </div>
                                <div className="showcase-detail-info">
                                    <span className="showcase-category">{selectedProduct.category}</span>
                                    <h2>{selectedProduct.name}</h2>
                                    <p className="showcase-detail-tagline">{selectedProduct.tagline}</p>
                                    <p className="showcase-detail-desc">{selectedProduct.description}</p>
                                    <div className="showcase-specs">
                                        {selectedProduct.specs.map(spec => (
                                            <div key={spec.label} className="showcase-spec">
                                                <span className="spec-value">{spec.value}</span>
                                                <span className="spec-label">{spec.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="showcase-detail-price">{selectedProduct.price}</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
