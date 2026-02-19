const express = require('express');
const router = express.Router();
const https = require('https');

// Static fallback data
const fallbackData = require('../data/stock.json');

// Cache to avoid hammering the API
let cache = {
    data: null,
    timestamp: 0,
    TTL: 60 * 1000, // 1 minute cache
};

/**
 * Fetch live TSLA data from Yahoo Finance (free, no API key)
 */
async function fetchLiveData() {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/TSLA?interval=5m&range=1d';

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`Yahoo Finance blocked request: ${response.status}`);

        const json = await response.json();
        const result = json.chart?.result?.[0];
        if (!result) throw new Error('No chart data found in response');

        const meta = result.meta;
        const timestamps = result.timestamp || [];
        const closes = result.indicators?.quote?.[0]?.close || [];

        // Build chart data points
        const chartData1D = timestamps.map((ts, i) => {
            const d = new Date(ts * 1000);
            const time = d.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
            return { time, price: closes[i] ? parseFloat(closes[i].toFixed(2)) : null };
        }).filter(p => p.price !== null);

        const currentPrice = meta.regularMarketPrice || closes[closes.length - 1];
        const previousClose = meta.chartPreviousClose || meta.previousClose;
        const change = parseFloat((currentPrice - previousClose).toFixed(2));
        const changePercent = parseFloat(((change / previousClose) * 100).toFixed(2));

        return {
            currentPrice: parseFloat(currentPrice.toFixed(2)),
            change,
            changePercent,
            '1D': chartData1D,
            live: true,
        };
    } catch (err) {
        throw err;
    }
}

router.get('/', async (req, res) => {
    const { range } = req.query;
    const now = Date.now();

    // Try live data (with cache)
    let liveData = null;
    if (cache.data && (now - cache.timestamp) < cache.TTL) {
        liveData = cache.data;
    } else {
        try {
            liveData = await fetchLiveData();
            cache.data = liveData;
            cache.timestamp = now;
        } catch (err) {
            console.log('Live stock fetch failed, using fallback:', err.message);
        }
    }

    if (liveData) {
        // For 1D, use live data. For 1W/1M, use fallback (Yahoo free API only gives 1D intraday)
        const chartDataForRange = (range === '1W' || range === '1M')
            ? (fallbackData[range] || [])
            : (liveData['1D'] || []);

        return res.json({
            currentPrice: liveData.currentPrice,
            change: liveData.change,
            changePercent: liveData.changePercent,
            support: fallbackData.support,
            resistance: fallbackData.resistance,
            movers: fallbackData.movers || [],
            catalysts: fallbackData.catalysts || [],
            range: range || '1D',
            data: chartDataForRange,
            live: true,
        });
    }

    // Fallback to static data
    const meta = {
        currentPrice: fallbackData.currentPrice,
        change: fallbackData.change,
        changePercent: fallbackData.changePercent,
        support: fallbackData.support,
        resistance: fallbackData.resistance,
        movers: fallbackData.movers || [],
        catalysts: fallbackData.catalysts || [],
        live: false,
    };

    if (range && fallbackData[range]) {
        return res.json({ ...meta, range, data: fallbackData[range] });
    }
    res.json({ ...meta, range: '1D', data: fallbackData['1D'] });
});

module.exports = router;
