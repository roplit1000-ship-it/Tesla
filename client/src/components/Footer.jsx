import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-top">
                    <div className="footer-brand">TESLA <span>UNIVERSE</span></div>
                    <div className="footer-links">
                        <Link to="/about">About</Link>
                        <a href="#privacy">Privacy</a>
                        <a href="#terms">Terms</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
