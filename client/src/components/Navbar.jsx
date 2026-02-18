import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/investor', label: 'Investor Simulation' },
    { path: '/newsroom', label: 'Newsroom' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/learn', label: 'Learn' },
    { path: '/future', label: 'Future' },
    { path: '/about', label: 'About' },
];

export default function Navbar({ onSubscribeClick }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const closeMobile = () => setMobileOpen(false);

    const handleLogout = () => {
        logout();
        closeMobile();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo" onClick={closeMobile}>
                        TESLA <span>UNIVERSE</span>
                    </Link>

                    <div className="navbar-links">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={location.pathname === link.path ? 'active' : ''}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {token ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`navbar-cta-dash ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                >
                                    Dashboard
                                </Link>
                                <button className="navbar-cta navbar-logout" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/auth" className="navbar-cta">
                                Sign Up
                            </Link>
                        )}
                    </div>

                    <div
                        className={`navbar-toggle ${mobileOpen ? 'open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            </nav>

            <div className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="mobile-menu-links">
                        {navLinks.map((link, i) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={closeMobile}
                                style={{ animationDelay: `${i * 0.06}s` }}
                            >
                                <span className="mobile-link-text">{link.label}</span>
                                <span className="mobile-link-arrow">→</span>
                            </Link>
                        ))}

                        {token && (
                            <Link
                                to="/dashboard"
                                className={`mobile-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                onClick={closeMobile}
                                style={{ animationDelay: `${navLinks.length * 0.06}s` }}
                            >
                                <span className="mobile-link-text">Dashboard</span>
                                <span className="mobile-link-arrow">→</span>
                            </Link>
                        )}
                    </div>
                    <div className="mobile-menu-footer">
                        {token ? (
                            <button className="navbar-cta mobile-cta" onClick={handleLogout}>
                                Logout
                            </button>
                        ) : (
                            <Link to="/auth" className="navbar-cta mobile-cta" onClick={closeMobile}>
                                Sign Up — Get Started
                            </Link>
                        )}
                        <p className="mobile-tagline">Markets · Machines · Momentum</p>
                    </div>
                </div>
            </div>
        </>
    );
}
