import { useState, useEffect } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import FilterTabs from '../components/FilterTabs';
import SubscribeBlock from '../components/SubscribeBlock';
import ScrollFadeIn from '../components/ScrollFadeIn';
import './Newsroom.css';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001`;
const categories = ['All', 'Company', 'Vehicles', 'Energy', 'AI', 'Regulation', 'Earnings'];

function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const fallbackArticles = [
    { id: 1, title: 'Tesla Surpasses $1 Trillion Market Cap Again', summary: 'Tesla reclaims its position in the trillion-dollar club as EV demand surges across global markets.', category: 'Company', sentiment: 'Bullish', image: '/images/news/market-cap.png', featured: true, publishedAt: '2026-02-13' },
    { id: 2, title: 'Cybertruck Deliveries Exceed Expectations', summary: 'Q4 Cybertruck numbers come in 40% above analyst consensus.', category: 'Vehicles', sentiment: 'Bullish', image: '/images/news/cybertruck-delivery.png', featured: false, publishedAt: '2026-02-12' },
    { id: 3, title: 'Megapack Revenue Doubles Year-Over-Year', summary: 'Tesla Energy division posts record revenue as utility-scale storage demand accelerates.', category: 'Energy', sentiment: 'Bullish', image: '/images/news/megapack.png', featured: false, publishedAt: '2026-02-11' },
    { id: 4, title: 'FSD v13 Begins Supervised Rollout', summary: 'Full Self-Driving version 13 marks a new generation of neural net architecture.', category: 'AI', sentiment: 'Bullish', image: '/images/news/fsd-v13.png', featured: false, publishedAt: '2026-02-10' },
    { id: 5, title: 'EU Proposes New EV Subsidy Framework', summary: 'European regulators push for expanded incentives that could benefit Tesla.', category: 'Regulation', sentiment: 'Neutral', image: '/images/news/eu-regulation.png', featured: false, publishedAt: '2026-02-09' },
    { id: 6, title: 'Tesla Q4 Earnings Beat Estimates', summary: 'Revenue and EPS both come in above Wall Street expectations.', category: 'Earnings', sentiment: 'Bullish', image: '/images/news/earnings-q4.png', featured: false, publishedAt: '2026-02-08' },
];

export default function Newsroom() {
    const [articles, setArticles] = useState(fallbackArticles);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        axios.get(`${API}/api/news`).then(res => {
            if (res.data?.length) setArticles(res.data);
        }).catch(() => { });
    }, []);

    const filtered = filter === 'All' ? articles : articles.filter(a => a.category === filter);
    const featured = articles.find(a => a.featured);
    const rest = filtered.filter(a => a.id !== (featured ? featured.id : null));

    return (
        <div className="newsroom-page">
            <section className="newsroom-header">
                <ScrollFadeIn>
                    <h1>Newsroom</h1>
                    <p>Curated Tesla intelligence. Every story tagged with sentiment.</p>
                </ScrollFadeIn>
                <FilterTabs tabs={categories} active={filter} onChange={setFilter} />
            </section>

            <section className="newsroom-body">
                <div className="news-main">
                    {featured && (
                        <ScrollFadeIn>
                            <div className="featured-card">
                                <div className="featured-img">
                                    <img src={featured.image} alt={featured.title} />
                                </div>
                                <div className="featured-content">
                                    <div className="news-card-meta">
                                        <span className="news-category">{featured.category}</span>
                                        <span className={`sentiment-tag ${featured.sentiment}`}>{featured.sentiment}</span>
                                    </div>
                                    <h2>{featured.title}</h2>
                                    <p>{featured.summary}</p>
                                    <div className="news-date">{formatDate(featured.publishedAt)}</div>
                                </div>
                            </div>
                        </ScrollFadeIn>
                    )}

                    <div className="news-grid">
                        {rest.map((article, i) => (
                            <ScrollFadeIn key={article.id} delay={i * 0.05}>
                                <GlassCard className="news-card">
                                    <div className="news-card-img">
                                        <img src={article.image} alt={article.title} loading="lazy" />
                                    </div>
                                    <div className="news-card-body">
                                        <div className="news-card-meta">
                                            <span className="news-category">{article.category}</span>
                                            <span className={`sentiment-tag ${article.sentiment}`}>{article.sentiment}</span>
                                        </div>
                                        <h3>{article.title}</h3>
                                        <p>{article.summary}</p>
                                        <div className="news-date">{formatDate(article.publishedAt)}</div>
                                    </div>
                                </GlassCard>
                            </ScrollFadeIn>
                        ))}
                    </div>
                </div>

                <aside className="news-sidebar">
                    <ScrollFadeIn>
                        <h3>Most Read</h3>
                        <div className="most-read">
                            {articles.slice(0, 5).map((a, i) => (
                                <div className="most-read-item" key={a.id}>
                                    <span className="most-read-num">{i + 1}</span>
                                    <div className="most-read-text">
                                        <p>{a.title}</p>
                                        <span className="most-read-date">{formatDate(a.publishedAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <SubscribeBlock />
                    </ScrollFadeIn>
                </aside>
            </section>
        </div>
    );
}
