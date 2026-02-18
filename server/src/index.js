const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const authRoutes = require('./routes/auth');
const subscribeRoutes = require('./routes/subscribe');
const contactRoutes = require('./routes/contact');
const simulationsRoutes = require('./routes/simulations');
const newsRoutes = require('./routes/news');
const productsRoutes = require('./routes/products');
const learnRoutes = require('./routes/learn');
const stockRoutes = require('./routes/stock');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc) + any local network origin
        if (!origin || origin.match(/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in dev
        }
    },
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/simulations', simulationsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/purchase', require('./routes/purchase'));
app.use('/api/admin', require('./routes/admin'));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('/{*splat}', (req, res) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} (all interfaces)`);
});
