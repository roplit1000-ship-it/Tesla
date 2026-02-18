import { useState, useRef, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login, register, token, verifyEmail, resendCode } = useAuth();
    const navigate = useNavigate();

    // Verification state
    const [verifyStep, setVerifyStep] = useState(false);
    const [verifyEmail_, setVerifyEmail_] = useState('');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef([]);

    if (token) return <Navigate to="/dashboard" replace />;

    const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

    // Cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (tab === 'signup') {
                if (form.password !== form.confirm) {
                    setError('Passwords do not match');
                    setSubmitting(false);
                    return;
                }
                if (form.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    setSubmitting(false);
                    return;
                }
                const result = await register(form.email, form.password, form.displayName);
                if (result.requiresVerification) {
                    setVerifyEmail_(result.email);
                    setVerifyStep(true);
                    setCooldown(60);
                }
            } else {
                const result = await login(form.email, form.password);
                if (result.requiresVerification) {
                    setVerifyEmail_(result.email);
                    setVerifyStep(true);
                    setCooldown(0);
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            const data = err.response?.data;
            if (data?.requiresVerification) {
                setVerifyEmail_(data.email);
                setVerifyStep(true);
                setCooldown(0);
            } else {
                const msg = data?.error || data?.errors?.[0]?.msg || 'Something went wrong';
                setError(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste
            const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
            const newCode = [...code];
            pasted.forEach((d, i) => {
                if (index + i < 6) newCode[index + i] = d;
            });
            setCode(newCode);
            const nextIdx = Math.min(index + pasted.length, 5);
            inputRefs.current[nextIdx]?.focus();
            return;
        }

        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleCodeKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const codeStr = code.join('');
        if (codeStr.length !== 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        setError('');
        setVerifying(true);
        try {
            await verifyEmail(verifyEmail_, codeStr);
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            const msg = err.response?.data?.error || 'Invalid code';
            setError(msg);
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;
        setResending(true);
        setError('');
        try {
            await resendCode(verifyEmail_);
            setCooldown(60);
            setCode(['', '', '', '', '', '']);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend');
        } finally {
            setResending(false);
        }
    };

    const switchTab = (t) => {
        setTab(t);
        setError('');
    };

    const goBack = () => {
        setVerifyStep(false);
        setCode(['', '', '', '', '', '']);
        setError('');
        setSuccess(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />

            <div className="auth-container">
                <motion.div
                    className="auth-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <AnimatePresence mode="wait">
                        {verifyStep ? (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Verification UI */}
                                <div className="auth-brand">
                                    <div className="auth-verify-icon">
                                        {success ? '✅' : '📧'}
                                    </div>
                                    <h1 className="auth-title">
                                        {success ? 'Verified!' : 'Check Your Email'}
                                    </h1>
                                    <p className="auth-subtitle">
                                        {success
                                            ? 'Your account is ready. Redirecting...'
                                            : <>We sent a 6-digit code to <strong>{verifyEmail_}</strong></>
                                        }
                                    </p>
                                </div>

                                {!success && (
                                    <>
                                        {/* Code Inputs */}
                                        <div className="auth-code-inputs">
                                            {code.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={el => inputRefs.current[i] = el}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={digit}
                                                    onChange={e => handleCodeChange(i, e.target.value)}
                                                    onKeyDown={e => handleCodeKeyDown(i, e)}
                                                    className={`auth-code-digit ${digit ? 'filled' : ''}`}
                                                    autoFocus={i === 0}
                                                />
                                            ))}
                                        </div>

                                        {error && (
                                            <motion.div
                                                className="auth-error"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        <button
                                            className="auth-submit"
                                            onClick={handleVerify}
                                            disabled={verifying || code.join('').length !== 6}
                                        >
                                            {verifying ? (
                                                <span className="auth-spinner" />
                                            ) : (
                                                'Verify Email'
                                            )}
                                        </button>

                                        <div className="auth-resend-row">
                                            <span className="auth-resend-text">Didn't get it?</span>
                                            <button
                                                className="auth-resend-btn"
                                                onClick={handleResend}
                                                disabled={cooldown > 0 || resending}
                                            >
                                                {resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                                            </button>
                                        </div>

                                        <div className="auth-footer">
                                            <p>
                                                <button onClick={goBack}>← Back to sign up</button>
                                            </p>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 30 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Logo / Brand */}
                                <div className="auth-brand">
                                    <div className="auth-logo">
                                        <svg viewBox="0 0 278 60" fill="currentColor" width="120">
                                            <path d="M139.5 4.8c-5 0-9.5.7-13.4 1.8l2.8 7.6c3-1 6.7-1.6 10.6-1.6 3.9 0 7.6.6 10.6 1.6l2.8-7.6c-3.9-1.1-8.4-1.8-13.4-1.8zm0 16c-2.6 0-4.7.3-6.3.7l6.3 33.5 6.3-33.5c-1.6-.4-3.7-.7-6.3-.7z" />
                                        </svg>
                                    </div>
                                    <h1 className="auth-title">
                                        {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                                    </h1>
                                    <p className="auth-subtitle">
                                        {tab === 'login'
                                            ? 'Sign in to access your Tesla Universe portal'
                                            : 'Join Tesla Universe and start exploring'}
                                    </p>
                                </div>

                                <div className="auth-tabs">
                                    <button
                                        className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
                                        onClick={() => switchTab('login')}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
                                        onClick={() => switchTab('signup')}
                                    >
                                        Sign Up
                                    </button>
                                    <div className={`auth-tab-indicator ${tab}`} />
                                </div>

                                <form onSubmit={handleSubmit} className="auth-form">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={tab}
                                            initial={{ opacity: 0, x: tab === 'signup' ? 20 : -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: tab === 'signup' ? -20 : 20 }}
                                            transition={{ duration: 0.25 }}
                                            className="auth-fields"
                                        >
                                            {tab === 'signup' && (
                                                <div className="auth-field">
                                                    <label>Display Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Elon M."
                                                        value={form.displayName}
                                                        onChange={update('displayName')}
                                                        required
                                                    />
                                                </div>
                                            )}

                                            <div className="auth-field">
                                                <label>Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={form.email}
                                                    onChange={update('email')}
                                                    required
                                                />
                                            </div>

                                            <div className="auth-field">
                                                <label>Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={form.password}
                                                    onChange={update('password')}
                                                    required
                                                />
                                            </div>

                                            {tab === 'signup' && (
                                                <div className="auth-field">
                                                    <label>Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={form.confirm}
                                                        onChange={update('confirm')}
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {error && (
                                        <motion.div
                                            className="auth-error"
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <button
                                        type="submit"
                                        className="auth-submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <span className="auth-spinner" />
                                        ) : (
                                            tab === 'login' ? 'Sign In' : 'Create Account'
                                        )}
                                    </button>
                                </form>

                                <div className="auth-footer">
                                    {tab === 'login' ? (
                                        <p>Don't have an account? <button onClick={() => switchTab('signup')}>Sign Up</button></p>
                                    ) : (
                                        <p>Already have an account? <button onClick={() => switchTab('login')}>Sign In</button></p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
