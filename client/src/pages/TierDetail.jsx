import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import ChartWidget from '../components/ChartWidget';
import ScrollFadeIn from '../components/ScrollFadeIn';
import GlassCard from '../components/GlassCard';
import PurchaseForm from '../components/PurchaseForm';
import './TierDetail.css';

/* ══════════════════════════════════════
   TIER DATA — enriched content per tier
   ══════════════════════════════════════ */
const tierData = {
    nebula: {
        name: 'Nebula',
        cls: 'nebula',
        tagline: 'Your launchpad into the Tesla investment universe',
        range: '$500 – $5,000',
        minDeposit: 500,
        maxDeposit: 5000,
        monthlyReturn: '2–4%',
        icon: '🌌',
        color: '#38bdf8',
        gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 40%, #06b6d4 100%)',
        benefits: [
            { icon: '📊', title: 'Weekly Market Alerts', desc: 'Get curated TSLA analysis and market signals delivered every week to stay ahead of trends.' },
            { icon: '📈', title: 'Basic Dashboard', desc: 'Access your personal investment dashboard with portfolio tracking, P&L, and tier progress.' },
            { icon: '👥', title: 'Community Access', desc: 'Join the Tesla Universe investor community — share insights, discuss strategies, network.' },
            { icon: '📰', title: 'Monthly Newsletter', desc: 'Exclusive monthly deep-dives into Tesla earnings, production numbers, and market outlook.' },
            { icon: '🎓', title: 'Learning Resources', desc: 'Access beginner-friendly courses on stock analysis, risk management, and portfolio building.' },
            { icon: '🔔', title: 'Price Alerts', desc: 'Set custom price alerts for TSLA and get notified instantly when targets are hit.' },
        ],
        stats: [
            { label: 'Avg. Annual Return', value: '24–48%' },
            { label: 'Risk Level', value: 'Low' },
            { label: 'Lock Period', value: 'None' },
            { label: 'Withdrawal', value: 'Anytime' },
        ],
    },
    apex: {
        name: 'Apex',
        cls: 'apex',
        tagline: 'Accelerate your portfolio with advanced tools and insights',
        range: '$5,000 – $25,000',
        minDeposit: 5000,
        maxDeposit: 25000,
        monthlyReturn: '3–6%',
        icon: '⚡',
        color: '#a78bfa',
        gradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 40%, #8b5cf6 100%)',
        benefits: [
            { icon: '🚨', title: 'Daily Market Alerts', desc: 'Real-time daily signals with entry/exit points, volume analysis, and sentiment scoring.' },
            { icon: '📊', title: 'Advanced Charts', desc: 'Professional-grade charting tools with technical indicators, overlays, and pattern recognition.' },
            { icon: '🧰', title: 'Portfolio Tools', desc: 'Diversification analyzer, risk calculator, rebalancing suggestions, and scenario modeling.' },
            { icon: '📧', title: 'Priority Email Support', desc: 'Get responses within 4 hours from our investment support team for any questions.' },
            { icon: '🎯', title: 'Earnings Playbook', desc: 'Pre-earnings analysis and post-earnings breakdown delivered before every Tesla quarterly report.' },
            { icon: '🔄', title: 'Auto-Rebalance Alerts', desc: 'Smart notifications when your portfolio drifts from optimal allocation — never miss a rebalance.' },
        ],
        stats: [
            { label: 'Avg. Annual Return', value: '36–72%' },
            { label: 'Risk Level', value: 'Medium' },
            { label: 'Lock Period', value: 'None' },
            { label: 'Withdrawal', value: 'Anytime' },
        ],
    },
    titan: {
        name: 'Titan',
        cls: 'titan',
        tagline: 'Institutional-grade access for serious investors',
        range: '$25,000 – $100,000',
        minDeposit: 25000,
        maxDeposit: 100000,
        monthlyReturn: '4–8%',
        icon: '🏆',
        color: '#fbbf24',
        gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #f59e0b 100%)',
        benefits: [
            { icon: '⚡', title: 'Real-Time Alerts', desc: 'Instant push notifications on TSLA price movements, unusual volume, and institutional activity.' },
            { icon: '🖥️', title: 'Full Dashboard Suite', desc: 'Complete portfolio management dashboard with multi-asset tracking, tax reporting, and analytics.' },
            { icon: '🧠', title: 'Priority Insights', desc: 'AI-powered market predictions, sentiment analysis, and early access to research reports.' },
            { icon: '📞', title: 'Quarterly Strategy Call', desc: 'One-on-one 30-minute call with a senior analyst to review your portfolio and optimize strategy.' },
            { icon: '🔒', title: 'Secured Positions', desc: 'Priority allocation in limited investment opportunities and pre-IPO access when available.' },
            { icon: '📋', title: 'Tax Optimization', desc: 'Automated tax-loss harvesting suggestions and year-end tax reporting for your portfolio.' },
        ],
        stats: [
            { label: 'Avg. Annual Return', value: '48–96%' },
            { label: 'Risk Level', value: 'Medium-High' },
            { label: 'Lock Period', value: '30 days' },
            { label: 'Withdrawal', value: '48hr processing' },
        ],
    },
    quantum: {
        name: 'Quantum',
        cls: 'quantum',
        tagline: 'The ultimate membership for elite Tesla investors',
        range: '$100,000+',
        minDeposit: 100000,
        maxDeposit: 500000,
        monthlyReturn: '5–12%',
        icon: '💎',
        color: '#f43f5e',
        gradient: 'linear-gradient(135deg, #881337 0%, #be123c 40%, #f43f5e 100%)',
        benefits: [
            { icon: '👤', title: 'Dedicated Analyst', desc: 'Your own personal investment analyst available via direct line — unlimited consultations.' },
            { icon: '📑', title: 'Custom Reports', desc: 'Tailored weekly research reports built around your portfolio, risk tolerance, and goals.' },
            { icon: '🌟', title: 'All Features Unlocked', desc: 'Every tool, alert, chart, and resource across all tiers — nothing is off limits.' },
            { icon: '🤝', title: 'VIP Concierge', desc: '24/7 white-glove service for deposits, withdrawals, transfers, and account management.' },
            { icon: '🎪', title: 'Exclusive Events', desc: 'Invitations to Tesla factory tours, investor meetups, product launches, and private webinars.' },
            { icon: '🏛️', title: 'Institutional Access', desc: 'Access to institutional-grade investment vehicles, structured products, and hedge strategies.' },
        ],
        stats: [
            { label: 'Avg. Annual Return', value: '60–144%' },
            { label: 'Risk Level', value: 'Managed' },
            { label: 'Lock Period', value: '90 days' },
            { label: 'Withdrawal', value: 'Priority 24hr' },
        ],
    },
};

const tierOrder = ['nebula', 'apex', 'titan', 'quantum'];

function generateGrowthData(deposit, months = 12, rate = 0.035) {
    const points = [];
    let value = deposit;
    for (let m = 0; m <= months; m++) {
        points.push({ time: `M${m}`, price: Math.round(value) });
        value *= 1 + (rate * (0.6 + Math.random() * 0.8));
    }
    return points;
}

export default function TierDetail() {
    const { tierSlug } = useParams();
    const navigate = useNavigate();
    const [showPurchase, setShowPurchase] = useState(false);

    const tier = tierData[tierSlug];

    if (!tier) {
        return (
            <div className="tier-not-found">
                <h2>Tier not found</h2>
                <p>The tier "{tierSlug}" doesn't exist.</p>
                <button onClick={() => navigate('/investor')}>← Back to Tiers</button>
            </div>
        );
    }

    const growthData = useMemo(() => generateGrowthData(tier.minDeposit), [tier.minDeposit]);
    const projected = growthData[growthData.length - 1]?.price || tier.minDeposit;
    const growthPercent = (((projected - tier.minDeposit) / tier.minDeposit) * 100).toFixed(0);

    const currentIndex = tierOrder.indexOf(tierSlug);
    const prevTier = currentIndex > 0 ? tierData[tierOrder[currentIndex - 1]] : null;
    const nextTier = currentIndex < tierOrder.length - 1 ? tierData[tierOrder[currentIndex + 1]] : null;

    return (
        <div className="tier-detail-page">
            {/* ══ HERO ══ */}
            <section className="td-hero" style={{ background: tier.gradient }}>
                <div className="td-hero-particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="td-particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }} />
                    ))}
                </div>
                <div className="td-hero-overlay" />
                <div className="td-hero-content">
                    <ScrollFadeIn>
                        <div className="td-hero-icon">{tier.icon}</div>
                        <span className={`td-tier-badge ${tier.cls}`}>{tier.name} TIER</span>
                        <h1 className="td-hero-title">{tier.name}</h1>
                        <p className="td-hero-tagline">{tier.tagline}</p>
                        <div className="td-hero-range">
                            <span className="td-range-label">Deposit Range</span>
                            <span className="td-range-value">{tier.range}</span>
                        </div>
                        <div className="td-hero-stats-row">
                            <div className="td-hero-stat">
                                <span className="td-stat-num">{tier.monthlyReturn}</span>
                                <span className="td-stat-label">Monthly Return</span>
                            </div>
                            <div className="td-hero-stat">
                                <span className="td-stat-num">{tier.benefits.length}</span>
                                <span className="td-stat-label">Benefits</span>
                            </div>
                            <div className="td-hero-stat">
                                <span className="td-stat-num">{growthPercent}%</span>
                                <span className="td-stat-label">12mo Projection</span>
                            </div>
                        </div>
                        <button className="td-hero-cta" onClick={() => setShowPurchase(true)}>
                            Get Started — {tier.name}
                        </button>
                    </ScrollFadeIn>
                </div>
            </section>

            {/* ══ BENEFITS ══ */}
            <section className="td-benefits">
                <ScrollFadeIn>
                    <span className="td-section-label">WHAT YOU GET</span>
                    <h2 className="td-section-title">Your {tier.name} Benefits</h2>
                </ScrollFadeIn>
                <div className="td-benefits-grid">
                    {tier.benefits.map((b, i) => (
                        <ScrollFadeIn key={b.title} delay={i * 0.08}>
                            <GlassCard className="td-benefit-card">
                                <div className="td-benefit-icon" style={{ background: `${tier.color}22` }}>
                                    {b.icon}
                                </div>
                                <h3>{b.title}</h3>
                                <p>{b.desc}</p>
                            </GlassCard>
                        </ScrollFadeIn>
                    ))}
                </div>
            </section>

            {/* ══ GROWTH PROJECTION ══ */}
            <section className="td-growth">
                <ScrollFadeIn>
                    <span className="td-section-label">PROJECTED GROWTH</span>
                    <h2 className="td-section-title">See Your Money Work</h2>
                    <p className="td-section-subtitle">
                        Simulated 12-month projection starting from ${tier.minDeposit.toLocaleString()}
                    </p>
                </ScrollFadeIn>
                <ScrollFadeIn delay={0.1}>
                    <div className="td-growth-card">
                        <div className="td-growth-header">
                            <div>
                                <span className="td-growth-label">Starting Deposit</span>
                                <span className="td-growth-value">${tier.minDeposit.toLocaleString()}</span>
                            </div>
                            <div className="td-growth-arrow">→</div>
                            <div>
                                <span className="td-growth-label">Projected Value</span>
                                <span className="td-growth-value td-growth-green">${projected.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="td-growth-label">Growth</span>
                                <span className="td-growth-value td-growth-green">+{growthPercent}%</span>
                            </div>
                        </div>
                        <div className="td-growth-chart">
                            <ChartWidget data={growthData} height={260} />
                        </div>
                    </div>
                </ScrollFadeIn>
            </section>

            {/* ══ KEY STATS ══ */}
            <section className="td-stats">
                <ScrollFadeIn>
                    <div className="td-stats-grid">
                        {tier.stats.map((s, i) => (
                            <div key={s.label} className="td-stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                                <span className="td-stat-card-value">{s.value}</span>
                                <span className="td-stat-card-label">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </ScrollFadeIn>
            </section>

            {/* ══ COMPARISON ══ */}
            <section className="td-compare">
                <ScrollFadeIn>
                    <span className="td-section-label">COMPARE</span>
                    <h2 className="td-section-title">How {tier.name} Stacks Up</h2>
                </ScrollFadeIn>
                <ScrollFadeIn delay={0.1}>
                    <div className="td-compare-table-wrap" data-tier={tierSlug} style={{ '--tier-accent': tier.color }}>
                        <table className="td-compare-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    {tierOrder.map(slug => (
                                        <th key={slug} className={slug === tierSlug ? 'td-current' : ''}>
                                            {tierData[slug].name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Deposit Range</td>
                                    {tierOrder.map(slug => (
                                        <td key={slug} className={slug === tierSlug ? 'td-current' : ''}>
                                            {tierData[slug].range}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>Monthly Return</td>
                                    {tierOrder.map(slug => (
                                        <td key={slug} className={slug === tierSlug ? 'td-current' : ''}>
                                            {tierData[slug].monthlyReturn}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>Benefits</td>
                                    {tierOrder.map(slug => (
                                        <td key={slug} className={slug === tierSlug ? 'td-current' : ''}>
                                            {tierData[slug].benefits.length}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>Alerts</td>
                                    {tierOrder.map((slug, idx) => (
                                        <td key={slug} className={slug === tierSlug ? 'td-current' : ''}>
                                            {['Weekly', 'Daily', 'Real-time', 'Instant'][idx]}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td>Analyst Access</td>
                                    {tierOrder.map((slug, idx) => (
                                        <td key={slug} className={slug === tierSlug ? 'td-current' : ''}>
                                            {['—', '—', 'Quarterly Call', 'Dedicated'][idx]}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </ScrollFadeIn>
            </section>

            {/* ══ NAVIGATION ══ */}
            <section className="td-nav">
                <div className="td-nav-inner">
                    {prevTier ? (
                        <button className="td-nav-btn td-nav-prev" onClick={() => navigate(`/tier/${tierOrder[currentIndex - 1]}`)}>
                            <span className="td-nav-dir">← Previous Tier</span>
                            <span className={`td-nav-name ${prevTier.cls}`}>{prevTier.name}</span>
                        </button>
                    ) : <div />}
                    {nextTier ? (
                        <button className="td-nav-btn td-nav-next" onClick={() => navigate(`/tier/${tierOrder[currentIndex + 1]}`)}>
                            <span className="td-nav-dir">Next Tier →</span>
                            <span className={`td-nav-name ${nextTier.cls}`}>{nextTier.name}</span>
                        </button>
                    ) : <div />}
                </div>
            </section>

            {/* ══ PURCHASE CTA ══ */}
            <section className="td-purchase-section">
                <ScrollFadeIn>
                    <div className="td-purchase-cta-card" style={{ borderColor: `${tier.color}33` }}>
                        <h2>Ready to join {tier.name}?</h2>
                        <p>Start your investment journey today with a deposit from {tier.range}.</p>
                        <button className="td-purchase-btn" style={{ background: tier.gradient }} onClick={() => setShowPurchase(true)}>
                            {tier.icon} Invest in {tier.name} — From ${tier.minDeposit.toLocaleString()}
                        </button>
                    </div>
                </ScrollFadeIn>
            </section>

            {/* ══ PURCHASE MODAL ══ */}
            {showPurchase && (
                <PurchaseForm
                    tier={tier}
                    onClose={() => setShowPurchase(false)}
                />
            )}
        </div>
    );
}
