import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChartWidget from '../components/ChartWidget';
import Button from '../components/Button';
import SubscribeBlock from '../components/SubscribeBlock';
import ScrollFadeIn from '../components/ScrollFadeIn';
import ProductShowcase from '../components/ProductShowcase';
import TeslaCarAnimation from '../components/TeslaCarAnimation';
import './Home.css';

const API = import.meta.env.VITE_API_URL || '';

const exploreTiles = [
    {
        title: 'Investor Simulation',
        desc: 'Build and test portfolio scenarios with real-time data.',
        path: '/investor',
        image: '/images/home/investor-sim.png',
        size: 'large',
    },
    {
        title: 'Tesla Newsroom',
        desc: 'Curated stories, analysis, and market sentiment.',
        path: '/newsroom',
        image: '/images/home/newsroom.png',
        size: 'medium',
    },
    {
        title: 'Vehicles & Energy',
        desc: 'Explore the full Tesla ecosystem.',
        path: '/marketplace',
        image: '/images/home/vehicles.png',
        size: 'medium',
    },
    {
        title: 'Marketplace',
        desc: 'Certified, refurbished, and limited drops.',
        path: '/marketplace',
        image: '/images/home/marketplace.png',
        size: 'medium',
    },
    {
        title: 'Learn Tesla Finance',
        desc: 'Courses on earnings, margins, and valuation.',
        path: '/learn',
        image: '/images/home/learn.png',
        size: 'medium',
    },
    {
        title: 'Future Tech',
        desc: 'Robotics, AI, autonomy, and beyond.',
        path: '/future',
        image: '/images/home/future-tech.png',
        size: 'wide',
    },
];

export default function Home() {
    const navigate = useNavigate();
    const [stockData, setStockData] = useState(null);
    const [range, setRange] = useState('1D');

    const fallback = {
        '1D': [
            { time: '9:30', price: 334.20 }, { time: '10:00', price: 336.50 },
            { time: '10:30', price: 335.10 }, { time: '11:00', price: 338.90 },
            { time: '11:30', price: 337.60 }, { time: '12:00', price: 340.20 },
            { time: '12:30', price: 339.80 }, { time: '13:00', price: 341.50 },
            { time: '13:30', price: 340.10 }, { time: '14:00', price: 343.20 },
            { time: '14:30', price: 341.90 }, { time: '15:00', price: 344.80 },
            { time: '15:30', price: 342.30 }, { time: '16:00', price: 342.75 },
        ],
        '1W': [
            { time: 'Mon', price: 328.40 }, { time: 'Tue', price: 331.10 },
            { time: 'Wed', price: 326.80 }, { time: 'Thu', price: 335.50 },
            { time: 'Fri', price: 338.90 }, { time: 'Sat', price: 340.20 },
            { time: 'Sun', price: 342.75 },
        ],
        '1M': [
            { time: 'Jan 15', price: 310.50 }, { time: 'Jan 18', price: 315.20 },
            { time: 'Jan 22', price: 308.70 }, { time: 'Jan 25', price: 318.90 },
            { time: 'Jan 29', price: 322.40 }, { time: 'Feb 1', price: 319.60 },
            { time: 'Feb 4', price: 325.80 }, { time: 'Feb 7', price: 330.10 },
            { time: 'Feb 10', price: 335.40 }, { time: 'Feb 14', price: 342.75 },
        ],
    };

    useEffect(() => {
        axios.get(`${API}/api/stock`).then(res => setStockData(res.data)).catch(() => {
            setStockData(null);
        });
    }, []);

    const chartData = stockData?.[range] || fallback[range];
    const price = stockData?.currentPrice || 342.75;
    const change = stockData?.change || 8.32;
    const changePercent = stockData?.changePercent || 2.49;

    return (
        <div className="home">
            {/* ═══ HERO — Full-Bleed Cinematic ═══ */}
            <section className="home-hero">
                <div className="hero-bg-image">
                    <img src="/images/hero/hero-bg.png" alt="" aria-hidden="true" />
                </div>
                <div className="hero-overlay" />

                <div className="hero-content">
                    <p className="hero-label hero-anim" style={{ animationDelay: '0.2s' }}>TESLA UNIVERSE</p>
                    <h1 className="hero-anim" style={{ animationDelay: '0.5s' }}>
                        Enter the<br />
                        <span className="highlight">Tesla Universe</span>
                    </h1>

                    {/* ── Animated Tesla Car ── */}
                    <div className="hero-anim" style={{ animationDelay: '0.9s' }}>
                        <TeslaCarAnimation />
                    </div>

                    <p className="subtitle hero-anim" style={{ animationDelay: '1.1s' }}>
                        Markets · Machines · Momentum<br />
                        Your interactive command center for the Tesla ecosystem.
                    </p>
                    <div className="hero-ctas hero-anim" style={{ animationDelay: '1.4s' }}>
                        <div className="hero-subscribe-wrap">
                            <div className="subscribe-glow" />
                            <span className="sparkle s1" />
                            <span className="sparkle s2" />
                            <span className="sparkle s3" />
                            <span className="sparkle s4" />
                            <span className="sparkle s5" />
                            <span className="sparkle s6" />
                            <span className="sparkle s7" />
                            <span className="sparkle s8" />
                            <Button onClick={() => navigate('/auth')}>✦ Subscribe</Button>
                        </div>
                        <Button variant="secondary" onClick={() => navigate('/investor')}>Simulation</Button>
                    </div>
                </div>

                {/* Floating Stock Ticker */}
                <div className="hero-ticker">
                    <div className="ticker-inner">
                        <div className="ticker-left">
                            <span className="ticker-symbol">TSLA</span>
                            <span className="simulation-badge">Live</span>
                        </div>
                        <div className="ticker-right">
                            <span className="ticker-price">${price.toFixed(2)}</span>
                            <span className={`ticker-change ${change >= 0 ? 'up' : 'down'}`}>
                                {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ EXPLORE — Bento Grid ═══ */}
            <section className="explore-section">
                <ScrollFadeIn>
                    <p className="section-label">EXPLORE</p>
                    <h2>Your Universe, <span className="highlight">Six Dimensions</span></h2>
                    <p className="section-subtitle">Every corner of the Tesla ecosystem, one click away.</p>
                </ScrollFadeIn>
                <div className="bento-grid">
                    {exploreTiles.map((tile, i) => (
                        <ScrollFadeIn key={tile.title} delay={i * 0.06} className={`bento-${tile.size}`}>
                            <div
                                className="bento-card"
                                onClick={() => navigate(tile.path)}
                            >
                                <img
                                    src={tile.image}
                                    alt={tile.title}
                                    className="bento-card-img"
                                    loading="lazy"
                                />
                                <div className="bento-card-overlay" />
                                <div className="bento-card-content">
                                    <h3>{tile.title}</h3>
                                    <p>{tile.desc}</p>
                                    <span className="bento-arrow">→</span>
                                </div>
                            </div>
                        </ScrollFadeIn>
                    ))}
                </div>
            </section>

            {/* ═══ TODAY'S PULSE ═══ */}
            <section className="pulse-section">
                <ScrollFadeIn>
                    <p className="section-label"><span className="pulse-dot" /> LIVE DATA</p>
                    <h2>Today's Pulse</h2>
                </ScrollFadeIn>
                <div className="pulse-grid">
                    <ScrollFadeIn>
                        <div className="pulse-chart-card">
                            <div className="range-toggles">
                                {['1D', '1W', '1M'].map(r => (
                                    <button
                                        key={r}
                                        className={`range-toggle ${range === r ? 'active' : ''}`}
                                        onClick={() => setRange(r)}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <ChartWidget data={chartData} height={280} />
                        </div>
                    </ScrollFadeIn>
                    <ScrollFadeIn delay={0.1}>
                        <div className="pulse-sidebar">
                            <h3>What Moved Today</h3>
                            <div className="movers-list">
                                {(stockData?.movers || [
                                    'Cybertruck deliveries beat estimates by 40%',
                                    'Megapack revenue doubled year-over-year',
                                    'FSD v13 supervised rollout begins',
                                ]).map((mover, i) => (
                                    <div className="mover-item" key={i}>
                                        <span className="mover-dot" />
                                        {mover}
                                    </div>
                                ))}
                            </div>
                            <h3>Catalyst Calendar</h3>
                            <div className="catalyst-list">
                                {(stockData?.catalysts || [
                                    { date: '2026-02-28', event: 'Q4 Earnings Report' },
                                    { date: '2026-03-15', event: 'Annual Shareholder Meeting' },
                                    { date: '2026-04-02', event: 'Q1 Delivery Numbers' },
                                ]).map((c, i) => (
                                    <div className="catalyst-item" key={i}>
                                        <span>{c.event}</span>
                                        <span className="catalyst-date">{c.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollFadeIn>
                </div>
            </section>

            {/* ═══ PRODUCT SHOWCASE ═══ */}
            <ProductShowcase />

            {/* ═══ SUBSCRIBE — Full-Bleed CTA ═══ */}
            <section className="home-subscribe-hero">
                <div className="subscribe-bg-image">
                    <img src="/images/hero/subscribe-bg.png" alt="" aria-hidden="true" />
                </div>
                <div className="subscribe-bg-overlay" />
                <div className="subscribe-hero-content">
                    <ScrollFadeIn>
                        <SubscribeBlock />
                    </ScrollFadeIn>
                </div>
            </section>
        </div>
    );
}
