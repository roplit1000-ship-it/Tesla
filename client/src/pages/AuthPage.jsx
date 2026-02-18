import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login, register, token } = useAuth();
    const navigate = useNavigate();

    if (token) return <Navigate to="/dashboard" replace />;

    const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

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
                await register(form.email, form.password, form.displayName);
            } else {
                await login(form.email, form.password);
            }
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Something went wrong';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const switchTab = (t) => {
        setTab(t);
        setError('');
    };

    return (
        <div className="auth-page">
            {/* Ambient glow orbs */}
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

                    {/* Tab Switcher */}
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

                    {/* Form */}
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

                    {/* Footer */}
                    <div className="auth-footer">
                        {tab === 'login' ? (
                            <p>Don't have an account? <button onClick={() => switchTab('signup')}>Sign Up</button></p>
                        ) : (
                            <p>Already have an account? <button onClick={() => switchTab('login')}>Sign In</button></p>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
