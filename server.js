/**
 * Unified Server - Serves both Frontend and Backend on Single Port
 * This combines Next.js frontend and Express backend on one localhost link
 */

const express = require('express');
const next = require('next');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

// Import backend routes (handle default exports from TypeScript)
const authRoutes = require('./backend/dist/routes/auth.routes').default || require('./backend/dist/routes/auth.routes');
const zkpRoutes = require('./backend/dist/routes/zkp.routes').default || require('./backend/dist/routes/zkp.routes');
const mlRoutes = require('./backend/dist/routes/ml.routes').default || require('./backend/dist/routes/ml.routes');
const datasetRoutes = require('./backend/dist/routes/dataset.routes').default || require('./backend/dist/routes/dataset.routes');

// Import database connection
const { connectDB } = require('./backend/dist/config/database');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js app
const nextApp = next({ dev, hostname, port: 3001 });
const handle = nextApp.getRequestHandler();

// Initialize Express app
const expressApp = express();

// Middleware
expressApp.use(helmet());
expressApp.use(cors({
  origin: `http://${hostname}:${port}`,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
expressApp.use(express.json({ limit: '10mb' }));
expressApp.use(express.urlencoded({ extended: true, limit: '10mb' }));
expressApp.use(morgan('dev'));

// Connect to database
try {
  connectDB();
} catch (error) {
  console.warn('Database connection warning (optional):', error.message);
}

// Backend API routes - Mount before Next.js routes
expressApp.use('/api/auth', authRoutes);
expressApp.use('/api/zkp', zkpRoutes);
expressApp.use('/api/ml', mlRoutes);
expressApp.use('/api/dataset', datasetRoutes);

// Health check endpoint
expressApp.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: 'running',
    frontend: 'running'
  });
});

// Handle Next.js requests - use middleware instead of route for Express 5
expressApp.use((req, res) => {
  return handle(req, res);
});

// Start server
nextApp.prepare().then(() => {
  expressApp.listen(port, (err) => {
    if (err) throw err;
    console.log('');
    console.log('🚀 ========================================');
    console.log('   ZKP Dashboard - Unified Server');
    console.log('🚀 ========================================');
    console.log('');
    console.log(`✅ Backend API: http://${hostname}:${port}/api`);
    console.log(`✅ Frontend:    http://${hostname}:${port}`);
    console.log(`✅ Demo Page:   http://${hostname}:${port}/demo`);
    console.log('');
    console.log('Everything is running on ONE localhost link!');
    console.log('');
    console.log(`👉 Open: http://${hostname}:${port}`);
    console.log('');
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
