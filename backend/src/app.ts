import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth.routes';
import zkpRoutes from './routes/zkp.routes';
import mlRoutes from './routes/ml.routes';
import datasetRoutes from './routes/dataset.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
config();

// Initialize express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/zkp', zkpRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/dataset', datasetRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
