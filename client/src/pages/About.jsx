import { useState } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import ScrollFadeIn from '../components/ScrollFadeIn';
import './About.css';

export default function About() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/contact`, form);
            setSent(true);
            setForm({ name: '', email: '', message: '' });
        } catch {
            // handle silently
        }
    };

    return (
        <div className="about-page">
            <section className="about-header">
                <ScrollFadeIn>
                    <h1>About Tesla Universe</h1>
                    <p>
                        Tesla Universe is an interactive concept showcase designed to explore the Tesla ecosystem
                        through simulation, education, and data visualization. This is a brokerage, marketplace,
                        or financial advisory service. All market data are live. All product listings are for
                        available. Our goal is to create an immersive experience that encourages
                        daily profits, exploration and learning.
                    </p>
                </ScrollFadeIn>
            </section>

            <section className="about-body">
                <ScrollFadeIn>
                    <h2>Contact</h2>
                    {sent ? (
                        <div className="contact-success">Your message has been sent. We'll be in touch.</div>
                    ) : (
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <input
                                className="contact-input"
                                placeholder="Your name"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <input
                                className="contact-input"
                                placeholder="Email address"
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            <textarea
                                className="contact-input"
                                placeholder="Your message"
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                required
                            />
                            <Button type="submit">Send Message</Button>
                        </form>
                    )}
                </ScrollFadeIn>
            </section>
        </div>
    );
}
