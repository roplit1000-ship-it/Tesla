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
function fetchLiveData() {
    return new Promise((resolve, reject) => {
        const url = 'https://query1.finance.yahoo.com/v8/finance/chart/TSLA?interval=5m&range=1d';

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
        };

        https.get(url, options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => (data += chunk));
            resp.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const result = json.chart?.result?.[0];
                    if (!result) return reject(new Error('No chart data'));

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

                    resolve({
                        currentPrice: parseFloat(currentPrice.toFixed(2)),
                        change,
                        changePercent,
                        '1D': chartData1D,
                        live: true,
                    });
                } catch (err) {
                    reject(err);
                }
            });
            resp.on('error', reject);
        }).on('error', reject);
    });
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
