import { useState, useEffect } from 'react';
import axios from 'axios';
import ChartWidget from './ChartWidget';
import './StockPanel.css';

const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
const RANGES = ['1D', '1W', '1M'];

export default function StockPanel() {
    const [range, setRange] = useState('1D');
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API}/api/stock`, { params: { range } })
            .then(res => setStock(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [range]);

    const isPositive = stock && stock.change >= 0;

    return (
        <div className="stock-panel">
            <div className="stock-panel-header">
                <div className="stock-panel-left">
                    <div className="stock-panel-label">
                        <span className="stock-ticker">TSLA</span>
                        <span className="stock-exchange">NASDAQ</span>
                    </div>
                    {stock && (
                        <>
                            <div className="stock-price">${stock.currentPrice?.toFixed(2)}</div>
                            <div className={`stock-change ${isPositive ? 'positive' : 'negative'}`}>
                                {isPositive ? '+' : ''}{stock.change?.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%)
                            </div>
                        </>
                    )}
                </div>

                <div className="stock-range-tabs">
                    {RANGES.map(r => (
                        <button
                            key={r}
                            className={`stock-range-tab ${range === r ? 'active' : ''}`}
                            onClick={() => setRange(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="stock-chart-area">
                {loading ? (
                    <div className="stock-chart-loading">
                        <div className="stock-shimmer" />
                    </div>
                ) : stock?.data ? (
                    <ChartWidget data={stock.data} height={220} />
                ) : null}
            </div>

            {stock && (
                <div className="stock-meta">
                    <div className="stock-meta-row">
                        <div className="stock-meta-item">
                            <span className="stock-meta-dot support" />
                            <span>Support</span>
                            <strong>${stock.support?.toFixed(2)}</strong>
                        </div>
                        <div className="stock-meta-item">
                            <span className="stock-meta-dot resistance" />
                            <span>Resistance</span>
                            <strong>${stock.resistance?.toFixed(2)}</strong>
                        </div>
                    </div>

                    {stock.movers?.length > 0 && (
                        <div className="stock-movers">
                            <div className="stock-movers-label">Market Movers</div>
                            {stock.movers.map((m, i) => (
                                <div key={i} className="stock-mover-item">
                                    <span className="stock-mover-bullet">⚡</span> {m}
                                </div>
                            ))}
                        </div>
                    )}

                    {stock.catalysts?.length > 0 && (
                        <div className="stock-catalysts">
                            <div className="stock-catalysts-label">Upcoming Catalysts</div>
                            {stock.catalysts.map((c, i) => (
                                <div key={i} className="stock-catalyst-item">
                                    <span className="stock-catalyst-date">{c.date}</span>
                                    <span>{c.event}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
