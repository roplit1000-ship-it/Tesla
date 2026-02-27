import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScrollFadeIn from '../components/ScrollFadeIn';
import GlassCard from '../components/GlassCard';
import './DepositPage.css';

const tierData = {
    nebula: {
        name: 'Nebula Package',
        minDeposit: 500,
        maxDeposit: 5000,
        color: '#38bdf8',
        gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 40%, #06b6d4 100%)',
        icon: '🌌',
        walletAddress: 'TNbF3DY4pcNEmiLhmMAD6zpMT4awgZaSvG',
        network: 'USDT (TRC20)',
        tagline: 'Initialize your portfolio with the right momentum.',
        benefits: ['Accessible entry level', 'Consistent steady growth', 'Exclusive community access']
    },
    apex: {
        name: 'Apex Package',
        minDeposit: 5000,
        maxDeposit: 25000,
        color: '#a78bfa',
        gradient: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 40%, #8b5cf6 100%)',
        icon: '⚡',
        walletAddress: 'TNbF3DY4pcNEmiLhmMAD6zpMT4awgZaSvG',
        network: 'USDT (TRC20)',
        tagline: 'Accelerated growth potential for stepping up your capital.',
        benefits: ['Accelerated growth rate', 'Mid-tier investment capacity', 'Enhanced performance']
    },
    titan: {
        name: 'Titan Package',
        minDeposit: 25000,
        maxDeposit: 100000,
        color: '#fbbf24',
        gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #f59e0b 100%)',
        icon: '🏆',
        walletAddress: 'TNbF3DY4pcNEmiLhmMAD6zpMT4awgZaSvG',
        network: 'USDT (TRC20)',
        tagline: 'Command the market with higher capacity and yield.',
        benefits: ['High-tier yield generation', 'Substantial capacity', 'Priority processing']
    },
    quantum: {
        name: 'Quantum Package',
        minDeposit: 100000,
        maxDeposit: 500000,
        color: '#f43f5e',
        gradient: 'linear-gradient(135deg, #881337 0%, #be123c 40%, #f43f5e 100%)',
        icon: '💎',
        walletAddress: 'TNbF3DY4pcNEmiLhmMAD6zpMT4awgZaSvG',
        network: 'USDT (TRC20)',
        tagline: 'Unprecedented capacity for maximum wealth generation.',
        benefits: ['Maximum yield potential', 'Unlimited capacity', 'VIP concierge services']
    },
};

export default function DepositPage() {
    const { tierSlug } = useParams();
    const navigate = useNavigate();
    const tier = tierData[tierSlug];

    const [amount, setAmount] = useState(tier ? tier.minDeposit : 0);
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!tier) navigate('/investor'); // Redirect if invalid tier
    }, [tier, navigate]);

    if (!tier) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(tier.walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmAmount = (e) => {
        e.preventDefault();
        if (amount >= tier.minDeposit && amount <= tier.maxDeposit) {
            setStep(2);
        } else {
            alert(`Amount must be between $${tier.minDeposit.toLocaleString()} and $${tier.maxDeposit.toLocaleString()}`);
        }
    };

    const handleConfirmPayment = () => {
        setStep(3);
        // Additional API calls for confirming deposit can go here
    };

    return (
        <div className="deposit-page" style={{ '--tier-color': tier.color, '--tier-gradient': tier.gradient }}>
            <div className="deposit-hero" style={{ background: tier.gradient }}>
                <div className="deposit-hero-particles">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="dp-particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }} />
                    ))}
                </div>
                <div className="deposit-hero-content">
                    <div className="dp-icon">{tier.icon}</div>
                    <h1>Fund Your {tier.name}</h1>
                    <p>{tier.tagline}</p>
                </div>
            </div>

            <div className="deposit-container">
                <ScrollFadeIn>
                    <div className="deposit-layout">
                        {/* LEFT COLUMN - FORM */}
                        <div className="deposit-main">
                            {step === 1 && (
                                <GlassCard className="dp-card">
                                    <h2 className="dp-card-title">1. Enter Deposit Amount</h2>
                                    <p className="dp-card-desc">Choose the amount you wish to invest in this package. Allowable range: ${tier.minDeposit.toLocaleString()} – ${tier.maxDeposit.toLocaleString()}</p>

                                    <form onSubmit={handleConfirmAmount}>
                                        <div className="dp-input-group">
                                            <span className="dp-currency">$</span>
                                            <input
                                                type="number"
                                                className="dp-input"
                                                value={amount}
                                                onChange={(e) => setAmount(Number(e.target.value))}
                                                min={tier.minDeposit}
                                                max={tier.maxDeposit}
                                            />
                                        </div>
                                        <div className="dp-quick-amounts">
                                            <button type="button" onClick={() => setAmount(tier.minDeposit)}>Min</button>
                                            <button type="button" onClick={() => setAmount(Math.floor((tier.minDeposit + tier.maxDeposit) / 2))}>Mid</button>
                                            <button type="button" onClick={() => setAmount(tier.maxDeposit)}>Max</button>
                                        </div>
                                        <button type="submit" className="dp-btn-primary" style={{ background: tier.gradient }}>Proceed to Payment</button>
                                    </form>
                                </GlassCard>
                            )}

                            {step === 2 && (
                                <GlassCard className="dp-card">
                                    <h2 className="dp-card-title">2. Make Your Transfer</h2>
                                    <p className="dp-card-desc">Send exactly <strong>${amount.toLocaleString()} {tier.network.split(' ')[0]}</strong> to the wallet address below via the <strong>{tier.network}</strong> network.</p>

                                    <div className="dp-wallet-box">
                                        <div className="dp-network-badge">{tier.network}</div>
                                        <div className="dp-wallet-address">{tier.walletAddress}</div>
                                        <button className="dp-copy-btn" onClick={handleCopy}>
                                            {copied ? 'Copied!' : 'Copy Address'}
                                        </button>
                                    </div>

                                    <div className="dp-warning">
                                        <span className="dp-warn-icon">⚠️</span>
                                        <p>Make sure you are sending using the correct network ({tier.network}). Sending funds to the wrong network may result in permanent loss.</p>
                                    </div>

                                    <div className="dp-actions">
                                        <button className="dp-btn-secondary" onClick={() => setStep(1)}>Back</button>
                                        <button className="dp-btn-primary" style={{ background: tier.gradient }} onClick={handleConfirmPayment}>I Have Made The Payment</button>
                                    </div>
                                </GlassCard>
                            )}

                            {step === 3 && (
                                <GlassCard className="dp-card dp-success-card">
                                    <div className="dp-success-icon" style={{ background: tier.gradient }}>✓</div>
                                    <h2 className="dp-card-title">Verification in Progress</h2>
                                    <p className="dp-card-desc">We are confirming your deposit of <strong>${amount.toLocaleString()}</strong> into the <strong>{tier.name}</strong> on the blockchain. Once confirmed, your dashboard will be updated automatically.</p>
                                    <button className="dp-btn-primary" style={{ background: tier.gradient }} onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                                </GlassCard>
                            )}
                        </div>

                        {/* RIGHT COLUMN - SUMMARY */}
                        <div className="deposit-sidebar">
                            <GlassCard className="dp-summary">
                                <h3>Package Summary</h3>
                                <div className="dp-summary-row">
                                    <span>Package</span>
                                    <span style={{ color: tier.color, fontWeight: 600 }}>{tier.name}</span>
                                </div>
                                <div className="dp-summary-row">
                                    <span>Status</span>
                                    <span style={{ color: '#22c55e' }}>Eligible</span>
                                </div>
                                <hr className="dp-divider" />
                                <div className="dp-benefits-list">
                                    <h4>Included Perks:</h4>
                                    <ul>
                                        {tier.benefits.map((b, i) => (
                                            <li key={i}><span style={{ color: tier.color }}>✦</span> {b}</li>
                                        ))}
                                    </ul>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </ScrollFadeIn>
            </div>
        </div>
    );
}
