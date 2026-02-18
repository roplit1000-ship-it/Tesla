import { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import './SubscribeBlock.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');

export default function SubscribeBlock() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        try {
            await axios.post(`${API}/api/subscribe`, { email });
            setSuccess(true);
            setEmail('');
        } catch {
            // silently fail for now
        }
    };

    return (
        <div className="subscribe-block">
            <h2>Stay in the Loop</h2>
            <p className="subtitle">One chart. Three bullets. One move. Delivered daily.</p>
            <form className="subscribe-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Button type="submit">Subscribe</Button>
            </form>
            {success && <p className="subscribe-success">You're in. Watch your inbox.</p>}
        </div>
    );
}
