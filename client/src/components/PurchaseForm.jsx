import { useState } from 'react';
import './PurchaseForm.css';

export default function PurchaseForm({ tier, product, onClose }) {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        depositAmount: tier ? tier.minDeposit : '',
        message: '',
    });
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const itemName = tier ? `${tier.name} Tier` : product?.name || 'Product';
    const itemRange = tier ? tier.range : product?.price || '';
    const gradient = tier ? tier.gradient : 'linear-gradient(135deg, #e82127 0%, #ff4444 100%)';
    const icon = tier ? tier.icon : '🛒';

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMsg('');

        try {
            const res = await fetch(`/api/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    itemType: tier ? 'tier' : 'product',
                    itemName,
                    tierSlug: tier?.cls || null,
                    productId: product?.id || null,
                }),
            });

            if (!res.ok) throw new Error('Failed to submit');
            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMsg('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="pf-overlay" onClick={onClose}>
            <div className="pf-modal" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="pf-close" onClick={onClose}>✕</button>

                {status === 'success' ? (
                    /* ── Success State ── */
                    <div className="pf-success">
                        <div className="pf-success-icon">✓</div>
                        <h2>Application Submitted!</h2>
                        <p>Thank you, <strong>{form.fullName}</strong>. Your interest in <strong>{itemName}</strong> has been received.</p>
                        <p className="pf-success-sub">Our team will reach out to you shortly at <strong>{form.email}</strong> to finalize your deposit.</p>
                        <button className="pf-success-btn" onClick={onClose}>Close</button>
                    </div>
                ) : (
                    /* ── Form State ── */
                    <>
                        <div className="pf-header" style={{ background: gradient }}>
                            <div className="pf-header-overlay" />
                            <div className="pf-header-content">
                                <span className="pf-item-icon">{icon}</span>
                                <h2>{tier ? `Invest in ${itemName}` : `Order ${itemName}`}</h2>
                                {itemRange && <span className="pf-range">{itemRange}</span>}
                            </div>
                        </div>

                        <form className="pf-form" onSubmit={handleSubmit}>
                            <div className="pf-field-group">
                                <div className="pf-field">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={form.fullName}
                                        onChange={handleChange('fullName')}
                                        required
                                    />
                                </div>
                                <div className="pf-field">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={form.email}
                                        onChange={handleChange('email')}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pf-field-group">
                                <div className="pf-field">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={form.phone}
                                        onChange={handleChange('phone')}
                                        required
                                    />
                                </div>
                                <div className="pf-field">
                                    <label>{tier ? 'Deposit Amount ($)' : 'Quantity'}</label>
                                    <input
                                        type="number"
                                        placeholder={tier ? tier.minDeposit.toString() : '1'}
                                        value={form.depositAmount}
                                        onChange={handleChange('depositAmount')}
                                        required
                                        min={tier ? tier.minDeposit : 1}
                                    />
                                </div>
                            </div>

                            <div className="pf-field full">
                                <label>Message (Optional)</label>
                                <textarea
                                    placeholder="Any questions or notes for our team..."
                                    value={form.message}
                                    onChange={handleChange('message')}
                                    rows={3}
                                />
                            </div>

                            {errorMsg && <div className="pf-error">{errorMsg}</div>}

                            <button
                                className="pf-submit"
                                type="submit"
                                disabled={status === 'sending'}
                                style={{ background: gradient }}
                            >
                                {status === 'sending' ? (
                                    <span className="pf-spinner" />
                                ) : (
                                    <>
                                        {icon} {tier ? 'Submit Deposit Application' : 'Submit Order'}
                                    </>
                                )}
                            </button>

                            <p className="pf-disclaimer">
                                By submitting, you agree to be contacted by our investment team. This does not constitute a binding agreement.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
