import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StockPanel from '../components/StockPanel';
import ChartWidget from '../components/ChartWidget';
import ScrollFadeIn from '../components/ScrollFadeIn';
import './Dashboard.css';

/* ═══════════════════════════════════════
   TIER PERSONALITIES — Each one is alive
   ═══════════════════════════════════════ */
const tiers = [
    {
        name: 'Nebula',
        cls: 'nebula',
        range: '$500 – $5,000',
        icon: '🌌',
        tagline: 'Your journey begins among the stars',
        vibe: 'Explorer',
        color: '#818cf8',
        glow: '#6366f1',
        perks: ['Weekly alerts', 'Basic dashboard', 'Community access'],
    },
    {
        name: 'Apex',
        cls: 'apex',
        range: '$5,000 – $25,000',
        icon: '⚡',
        tagline: 'Momentum is building — you\'re accelerating',
        vibe: 'Accelerator',
        color: '#fbbf24',
        glow: '#f59e0b',
        perks: ['Daily alerts', 'Advanced charts', 'Portfolio tools'],
    },
    {
        name: 'Titan',
        cls: 'titan',
        range: '$25,000 – $100,000',
        icon: '🔥',
        tagline: 'Power moves only — the world is watching',
        vibe: 'Powerhouse',
        color: '#f87171',
        glow: '#ef4444',
        perks: ['Real-time alerts', 'Full dashboard', 'Priority insights'],
    },
    {
        name: 'Quantum',
        cls: 'quantum',
        range: '$100,000+',
        icon: '👑',
        tagline: 'You\'ve transcended — welcome to the elite',
        vibe: 'Visionary',
        color: '#c084fc',
        glow: '#a855f7',
        perks: ['Dedicated analyst', 'Custom reports', 'All features unlocked'],
    },
];

/* ── Animated Tier Card Component ── */
function TierCard({ tier, index, onClick }) {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            className={`tier-card tier-card-${tier.cls}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            style={{
                '--mouse-x': `${mousePos.x}%`,
                '--mouse-y': `${mousePos.y}%`,
                '--tier-color': tier.color,
                '--tier-glow': tier.glow,
            }}
        >
            {/* Animated background effects */}
            <div className="tier-card-bg">
                <div className="tier-card-glow" />
                <div className="tier-card-shimmer" />

                {/* Floating particles unique to each tier */}
                <div className="tier-particles">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`tier-particle tp-${i + 1}`} />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="tier-card-content">
                {/* Animated icon */}
                <div className="tier-card-icon">{tier.icon}</div>

                {/* Name with glow */}
                <h3 className="tier-card-name">{tier.name}</h3>
                <div className="tier-card-vibe">{tier.vibe}</div>

                {/* Divider line */}
                <div className="tier-card-divider" />

                {/* Range */}
                <div className="tier-card-range">{tier.range}</div>

                {/* Tagline */}
                <p className="tier-card-tagline">"{tier.tagline}"</p>

                {/* Perks */}
                <div className="tier-card-perks">
                    {tier.perks.map(p => (
                        <div className="tier-card-perk" key={p}>
                            <span className="perk-dot" />
                            {p}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <button className="tier-card-cta" onClick={(e) => { e.stopPropagation(); onClick(); }}>
                    Enter {tier.name} →
                </button>
            </div>
        </motion.div>
    );
}

function generateGrowthData(deposit) {
    const points = [];
    let value = deposit;
    for (let m = 0; m <= 12; m++) {
        points.push({ time: `M${m}`, price: Math.round(value) });
        value *= 1 + (0.02 + Math.random() * 0.03);
    }
    return points;
}

export default function Dashboard() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [deposit, setDeposit] = useState(10000);

    const growthData = useMemo(() => generateGrowthData(deposit), [deposit]);
    const projected = growthData[growthData.length - 1]?.price || deposit;

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    return (
        <div className="dashboard-page">
            {/* ── Welcome Header ── */}
            <section className="dash-welcome">
                <motion.div
                    className="dash-welcome-inner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="dash-welcome-left">
                        <div className="dash-avatar">
                            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h1 className="dash-greeting">Welcome back, <span>{user?.displayName || 'Explorer'}</span></h1>
                            <p className="dash-member-since">Member since {memberSince}</p>
                        </div>
                    </div>
                    <div className="dash-balance">
                        <div className="dash-balance-amount">${(user?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className="dash-balance-label">Balance</div>
                        {user?.profitPercent !== undefined && user.profitPercent !== 0 && (
                            <div className={`dash-profit-badge ${user.profitPercent >= 0 ? 'profit-up' : 'profit-down'}`}>
                                <span className="profit-arrow">{user.profitPercent >= 0 ? '↑' : '↓'}</span>
                                {Math.abs(user.profitPercent).toFixed(2)}% this week
                            </div>
                        )}
                    </div>
                </motion.div>
            </section>

            {/* ── Main Grid ── */}
            <div className="dash-grid dash-grid-full">
                <div className="dash-col-main">
                    {/* Tesla Stock */}
                    <ScrollFadeIn>
                        <div className="dash-section">
                            <div className="dash-section-header">
                                <h2>Tesla Shares</h2>
                                <span className="dash-live-badge">
                                    <span className="dash-live-dot" /> Live Data
                                </span>
                            </div>
                            <StockPanel />
                        </div>
                    </ScrollFadeIn>

                    {/* ★ Investment Tiers — Extraordinary Cards ★ */}
                    <ScrollFadeIn delay={0.1}>
                        <div className="dash-section dash-tier-section">
                            <div className="dash-section-header">
                                <h2>Investment Tiers</h2>
                                <span className="dash-tier-subtitle">Choose your path</span>
                            </div>
                            <div className="dash-tier-grid">
                                {tiers.map((tier, i) => (
                                    <TierCard
                                        key={tier.name}
                                        tier={tier}
                                        index={i}
                                        onClick={() => navigate(`/tier/${tier.cls}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    </ScrollFadeIn>

                    {/* 🛒 Marketplace — Featured Products */}
                    <ScrollFadeIn delay={0.12}>
                        <div className="dash-section dash-marketplace-section">
                            <div className="dash-section-header">
                                <h2>🛒 Marketplace</h2>
                                <a href="/marketplace" className="dash-see-all">View All →</a>
                            </div>
                            <div className="dash-marketplace-grid">
                                {[
                                    { id: 'f1', name: 'Model 3 Long Range', price: '$45,990', image: '/images/products/model-3-lr.png', tag: 'New' },
                                    { id: 'f2', name: 'Model S', price: '$74,990', image: '/images/products/model-s.png', tag: 'Certified' },
                                    { id: 'f3', name: 'Roadster', price: '$200,000', image: '/images/products/roadster.png', tag: 'Limited' },
                                    { id: 'f4', name: 'Optimus Gen 2', price: '$25,000', image: '/images/products/optimus-gen2.png', tag: 'New' },
                                ].map(product => (
                                    <div
                                        key={product.id}
                                        className="dash-market-card"
                                        onClick={() => navigate('/marketplace')}
                                    >
                                        <div className="dash-market-img">
                                            <img src={product.image} alt={product.name} loading="lazy" />
                                            <div className="dash-market-overlay">
                                                <span>View Details →</span>
                                            </div>
                                        </div>
                                        <div className="dash-market-info">
                                            <div className="dash-market-name">{product.name}</div>
                                            <div className="dash-market-bottom">
                                                <span className="dash-market-price">{product.price}</span>
                                                <span className={`dash-market-tag ${product.tag}`}>
                                                    {product.tag}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollFadeIn>

                    {/* Portfolio Sandbox */}
                    <ScrollFadeIn delay={0.15}>
                        <div className="dash-section">
                            <div className="dash-section-header">
                                <h2>Portfolio Sandbox</h2>
                            </div>
                            <div className="dash-sandbox">
                                <div className="dash-sandbox-controls">
                                    <label>Simulated Deposit</label>
                                    <input
                                        type="range"
                                        className="sandbox-slider"
                                        min="500"
                                        max="200000"
                                        step="500"
                                        value={deposit}
                                        onChange={e => setDeposit(Number(e.target.value))}
                                    />
                                    <div className="sandbox-value">${deposit.toLocaleString()}</div>
                                    <div className="sandbox-projected">
                                        Projected 12mo: <span>${projected.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="dash-sandbox-chart">
                                    <ChartWidget data={growthData} height={200} />
                                </div>
                            </div>
                        </div>
                    </ScrollFadeIn>
                </div>
            </div>
        </div>
    );
}
