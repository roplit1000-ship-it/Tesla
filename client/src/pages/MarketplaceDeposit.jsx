import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollFadeIn from '../components/ScrollFadeIn';
import GlassCard from '../components/GlassCard';
import './MarketplaceDeposit.css';

export default function MarketplaceDeposit() {
    const navigate = useNavigate();

    // Default amount matching the email template, but they are fully free to change it.
    const [amount, setAmount] = useState('2450');
    const numericAmount = Number(amount) || 0;
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [copied, setCopied] = useState(false);

    const walletAddress = 'TNbF3DY4pcNEmiLhmMAD6zpMT4awgZaSvG';
    const network = 'USDT (TRC20)';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConfirmAmount = (e) => {
        e.preventDefault();
        if (numericAmount > 0) {
            setStep(2);
        } else {
            alert('Please enter a valid amount greater than $0.');
        }
    };

    const handleConfirmPayment = () => {
        setStep(3);
    };

    return (
        <div className="mkp-deposit-page">
            <div className="mkp-hero">
                <div className="mkp-hero-particles">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="mkp-particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }} />
                    ))}
                </div>
                <div className="mkp-hero-content">
                    <div className="mkp-icon">🛍️</div>
                    <h1>Complete Your Order</h1>
                    <p>Finalize your secure marketplace transaction.</p>
                </div>
            </div>

            <div className="mkp-container">
                <ScrollFadeIn>
                    <div className="mkp-layout">
                        {/* LEFT COLUMN - FORM */}
                        <div className="mkp-main">
                            {step === 1 && (
                                <GlassCard className="mkp-card">
                                    <h2 className="mkp-card-title">1. Review Order Amount</h2>
                                    <p className="mkp-card-desc">Enter the total amount for your marketplace purchase. You can adjust this to match your specific invoice or custom order requirements.</p>

                                    <form onSubmit={handleConfirmAmount}>
                                        <div className="mkp-input-group">
                                            <span className="mkp-currency">$</span>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                className="mkp-input"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder="0"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="mkp-btn-primary">Proceed to Secure Payment</button>
                                    </form>
                                </GlassCard>
                            )}

                            {step === 2 && (
                                <GlassCard className="mkp-card">
                                    <h2 className="mkp-card-title">2. Transfer Funds</h2>
                                    <p className="mkp-card-desc">Send exactly <strong>${numericAmount.toLocaleString()} {network.split(' ')[0]}</strong> to our secure marketplace escrow wallet via the <strong>{network}</strong> network.</p>

                                    <div className="mkp-wallet-box">
                                        <div className="mkp-network-badge">{network}</div>
                                        <div className="mkp-wallet-address">{walletAddress}</div>
                                        <button type="button" className="mkp-copy-btn" onClick={handleCopy}>
                                            {copied ? 'Copied!' : 'Copy Address'}
                                        </button>
                                    </div>

                                    <div className="mkp-warning">
                                        <span className="mkp-warn-icon">⚠️</span>
                                        <p>Critical: Ensure you are sending via <strong>{network}</strong>. Sending over any other network (like ERC20 or BEP20) will result in permanent loss of funds.</p>
                                    </div>

                                    <div className="mkp-actions">
                                        <button type="button" className="mkp-btn-secondary" onClick={() => setStep(1)}>Back</button>
                                        <button type="button" className="mkp-btn-primary" onClick={handleConfirmPayment}>I Have Made The Transfer</button>
                                    </div>
                                </GlassCard>
                            )}

                            {step === 3 && (
                                <GlassCard className="mkp-card mkp-success-card">
                                    <div className="mkp-success-icon">✓</div>
                                    <h2 className="mkp-card-title">Payment Verification Pending</h2>
                                    <p className="mkp-card-desc">Your payment of <strong>${numericAmount.toLocaleString()}</strong> has been submitted. Our systems are currently verifying the blockchain transaction. Your order status will update shortly.</p>
                                    <button type="button" className="mkp-btn-primary" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
                                </GlassCard>
                            )}
                        </div>

                        {/* RIGHT COLUMN - SUMMARY */}
                        <div className="mkp-sidebar">
                            <GlassCard className="mkp-summary">
                                <h3>Transaction Summary</h3>
                                <div className="mkp-summary-row">
                                    <span>Payment Type</span>
                                    <span style={{ color: '#fff', fontWeight: 600 }}>Marketplace Order</span>
                                </div>
                                <div className="mkp-summary-row">
                                    <span>Network</span>
                                    <span style={{ color: '#22c55e' }}>{network}</span>
                                </div>
                                <div className="mkp-summary-row mkp-total-row">
                                    <span>Total Amount</span>
                                    <span>${numericAmount.toLocaleString()}</span>
                                </div>
                                <hr className="mkp-divider" />
                                <div className="mkp-trust-badges">
                                    <div className="mkp-badge">🔒 End-to-End Encrypted</div>
                                    <div className="mkp-badge">🛡️ Blockchain Verified</div>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </ScrollFadeIn>
            </div>
        </div>
    );
}
