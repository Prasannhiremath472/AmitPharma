require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const path = require('path');

const authRoutes     = require('./routes/authRoutes');
const productRoutes  = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const cartRoutes     = require('./routes/cartRoutes');
const userRoutes     = require('./routes/userRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');
const couponRoutes   = require('./routes/couponRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, Hostinger health checks)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ─── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
});

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── XSS sanitization ────────────────────────────────────────────────────────
const sanitizeBody = (obj) => {
  if (!obj || typeof obj !== 'object') return;
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'string') obj[key] = xss(obj[key]);
    else if (typeof obj[key] === 'object') sanitizeBody(obj[key]);
  });
};
app.use((req, _res, next) => {
  if (req.body) sanitizeBody(req.body);
  next();
});

// ─── Static files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Root probe — Hostinger / load balancer health check ─────────────────────
app.get('/', (_req, res) => {
  res.json({
    success: true,
    name: 'Amit R. Medical API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// ─── Detailed health check ────────────────────────────────────────────────────
app.get('/health', async (_req, res) => {
  let dbStatus = 'unknown';
  try {
    const { pool } = require('./config/db');
    const conn = await pool.getConnection();
    conn.release();
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  const healthy = dbStatus === 'connected';
  res.status(healthy ? 200 : 503).json({
    success: healthy,
    status: healthy ? 'healthy' : 'degraded',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',       authLimiter, authRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders',     orderRoutes);
app.use('/api/cart',       cartRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/admin',      adminRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/coupons',    couponRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
