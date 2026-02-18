import GlassCard from '../components/GlassCard';
import ScrollFadeIn from '../components/ScrollFadeIn';
import './Future.css';

const sections = [
    { title: 'Beyond Earth', desc: "Tesla's mission extends beyond terrestrial boundaries. From space-grade materials in the Cybertruck to Starlink integration, the Tesla ecosystem is designed for a multi-planetary future. Energy independence starts on Earth and scales outward.", image: '/images/future/beyond-earth.png', reverse: false },
    { title: 'Robotics', desc: "Optimus represents Tesla's entry into humanoid robotics. Built on the same AI foundations as Autopilot, these robots will initially handle dangerous and repetitive factory tasks before expanding to consumer and industrial applications.", image: '/images/future/robotics.png', reverse: true },
    { title: 'Artificial Intelligence', desc: "Tesla's Dojo supercomputer and custom AI training infrastructure position the company at the frontier of real-world AI. From vision-based navigation to natural language processing, Tesla is building an end-to-end AI stack.", image: '/images/future/ai.png', reverse: false },
    { title: 'Energy Grid', desc: "Megapack and Powerwall form the backbone of a distributed energy grid. Virtual power plants, solar roofs, and battery storage create a decentralized energy network that could reshape how the world generates and consumes power.", image: '/images/future/energy-grid.png', reverse: true },
    { title: 'Autonomy', desc: "Full Self-Driving represents the largest AI deployment in the real world. With billions of miles of training data from the fleet, Tesla's approach to autonomy is unique — camera-only perception, end-to-end neural networks, and continuous over-the-air improvement.", image: '/images/future/autonomy.png', reverse: false },
];

const timeline = [
    { year: '2025', title: 'Optimus Factory Deployment', desc: 'First supervised humanoid robots working alongside humans in Tesla factories.' },
    { year: '2026', title: 'Supervised FSD Nationwide', desc: 'Full Self-Driving available with supervision across all US states.' },
    { year: '2027', title: 'Robotaxi Launch', desc: 'Autonomous ride-hailing network begins operation in select metros.' },
    { year: '2028', title: 'Next-Gen Vehicle Platform', desc: 'Sub-$25,000 Tesla on the next-generation manufacturing platform.' },
    { year: '2030', title: 'Energy Grid Scale', desc: 'Tesla Energy reaches 1 TWh of deployed storage capacity globally.' },
    { year: '2035', title: 'Optimus Consumer', desc: 'Humanoid robots available for consumer purchase and home assistance.' },
];

export default function Future() {
    return (
        <div className="future-page">
            <section className="future-hero">
                <ScrollFadeIn>
                    <h1>The <span>Future</span> is Being Built</h1>
                    <p>Explore the technologies Tesla is developing to reshape transportation, energy, and artificial intelligence.</p>
                </ScrollFadeIn>
            </section>

            <div className="future-sections">
                {sections.map((s, i) => (
                    <ScrollFadeIn key={s.title} delay={0.05}>
                        <div className={`future-section ${s.reverse ? 'reverse' : ''}`}>
                            <div className="future-section-visual">
                                <img src={s.image} alt={s.title} />
                            </div>
                            <div className="future-section-text">
                                <h2>{s.title}</h2>
                                <p>{s.desc}</p>
                            </div>
                        </div>
                    </ScrollFadeIn>
                ))}
            </div>

            <section className="future-timeline">
                <ScrollFadeIn>
                    <h2>The Road Ahead</h2>
                </ScrollFadeIn>
                <div className="timeline-grid">
                    {timeline.map((t, i) => (
                        <ScrollFadeIn key={t.year} delay={i * 0.06}>
                            <GlassCard className="timeline-card">
                                <div className="timeline-year">{t.year}</div>
                                <h4>{t.title}</h4>
                                <p>{t.desc}</p>
                            </GlassCard>
                        </ScrollFadeIn>
                    ))}
                </div>
            </section>
        </div>
    );
}
