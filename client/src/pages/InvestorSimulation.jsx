import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Button from '../components/Button';
import ChartWidget from '../components/ChartWidget';
import Modal from '../components/Modal';
import ScrollFadeIn from '../components/ScrollFadeIn';
import './InvestorSimulation.css';

const API = import.meta.env.VITE_API_URL || '';

/* ── Same tier personalities as Dashboard ── */
const tiers = [
    {
        name: 'Nebula', cls: 'nebula', range: '$500 – $5,000',
        icon: '🌌', tagline: 'Your journey begins among the stars', vibe: 'Explorer',
        color: '#818cf8', glow: '#6366f1',
        perks: ['Weekly alerts', 'Basic dashboard', 'Community access'],
    },
    {
        name: 'Apex', cls: 'apex', range: '$5,000 – $25,000',
        icon: '⚡', tagline: "Momentum is building — you're accelerating", vibe: 'Accelerator',
        color: '#fbbf24', glow: '#f59e0b',
        perks: ['Daily alerts', 'Advanced charts', 'Portfolio tools'],
    },
    {
        name: 'Titan', cls: 'titan', range: '$25,000 – $100,000',
        icon: '🔥', tagline: 'Power moves only — the world is watching', vibe: 'Powerhouse',
        color: '#f87171', glow: '#ef4444',
        perks: ['Real-time alerts', 'Full dashboard', 'Priority insights'],
    },
    {
        name: 'Quantum', cls: 'quantum', range: '$100,000+',
        icon: '👑', tagline: "You've transcended — welcome to the elite", vibe: 'Visionary',
        color: '#c084fc', glow: '#a855f7',
        perks: ['Dedicated analyst', 'Custom reports', 'All features unlocked'],
    },
];

/* ── Animated Tier Card (same as Dashboard) ── */
function TierCard({ tier, index, onClick }) {
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
            className={`sim-tier-card sim-tier-${tier.cls}`}
            onMouseMove={handleMouseMove}
            onClick={onClick}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            style={{ '--mx': `${mousePos.x}%`, '--my': `${mousePos.y}%` }}
        >
            <div className="sim-tier-glow" />
            <div className="sim-tier-icon">{tier.icon}</div>
            <h3>{tier.name}</h3>
            <span className="sim-tier-badge">{tier.vibe}</span>
            <p className="sim-tier-range">{tier.range}</p>
            <p className="sim-tier-tagline">{tier.tagline}</p>
            <ul className="sim-tier-perks">
                {tier.perks.map(p => <li key={p}>{p}</li>)}
            </ul>
            <div className="sim-tier-cta">Explore →</div>
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

export default function InvestorSimulation() {
    const [deposit, setDeposit] = useState(10000);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Live stock data
    const [stockData, setStockData] = useState(null);
    useEffect(() => {
        axios.get(`${API}/api/stock`)
            .then(res => setStockData(res.data))
            .catch(() => setStockData(null));
    }, []);

    const growthData = useMemo(() => generateGrowthData(deposit), [deposit]);
    const projected = growthData[growthData.length - 1]?.price || deposit;

    const price = stockData?.currentPrice || 342.75;
    const change = stockData?.change || 8.32;
    const changePct = stockData?.changePercent || 2.49;
    const chartPoints = stockData?.data || [
        { time: '9:30', price: 334 }, { time: '10:30', price: 337 },
        { time: '11:30', price: 340 }, { time: '12:30', price: 341 },
        { time: '13:30', price: 342 }, { time: '14:30', price: 343 },
        { time: '15:30', price: 342.75 },
    ];
    const support = stockData?.support || '$318.00';
    const resistance = stockData?.resistance || '$360.00';
    const isUp = change >= 0;

    return (
        <div className="investor-page">
            <section className="investor-header">
                <ScrollFadeIn>
                    <div className="price-panel">
                        <div className="price-main">
                            {stockData?.live && <span className="simulation-badge live-badge" style={{ marginBottom: 8, display: 'inline-block' }}>● Live</span>}
                            <h2>${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                            <span style={{ color: isUp ? '#22c55e' : '#ef4444', fontWeight: 600, fontSize: '0.95rem' }}>
                                {isUp ? '+' : ''}${change.toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
                            </span>
                        </div>
                        <div className="price-chart-area">
                            <ChartWidget data={chartPoints} height={160} />
                        </div>
                        <div className="price-labels">
                            <div className="price-label"><span className="price-label-dot support" /> Support: {support}</div>
                            <div className="price-label"><span className="price-label-dot resistance" /> Resistance: {resistance}</div>
                        </div>
                    </div>
                </ScrollFadeIn>
            </section>

            <section className="tiers-section">
                <ScrollFadeIn>
                    <h2>Investment Tiers</h2>
                    <p>Choose your starting point. Explore the growth scenarios.</p>
                </ScrollFadeIn>
                <div className="tier-grid sim-tier-grid">
                    {tiers.map((tier, i) => (
                        <TierCard
                            key={tier.name}
                            tier={tier}
                            index={i}
                            onClick={() => navigate(`/tier/${tier.cls}`)}
                        />
                    ))}
                </div>
            </section>

            <section className="sandbox-section">
                <ScrollFadeIn>
                    <h2>Portfolio Sandbox</h2>
                    <p>Adjust your simulated deposit and see projected growth over 12 months.</p>
                </ScrollFadeIn>
                <ScrollFadeIn delay={0.1}>
                    <div className="sandbox-card">
                        <div className="sandbox-controls">
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
                                Projected 12-month value: <span>${projected.toLocaleString()}</span>
                            </div>
                            <Button onClick={() => setShowModal(true)}>Save Scenario</Button>
                        </div>
                        <div>
                            <ChartWidget data={growthData} height={240} />
                        </div>
                    </div>
                </ScrollFadeIn>
            </section>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2>Sign Up to Save</h2>
                <p>Create a free account to save your simulation scenarios and track them over time.</p>
                <input className="modal-input" placeholder="Email address" type="email" />
                <input className="modal-input" placeholder="Password" type="password" />
                <Button full onClick={() => setShowModal(false)}>Create Account</Button>
            </Modal>
        </div>
    );
}
