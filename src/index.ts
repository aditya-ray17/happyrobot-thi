import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loadsRouter from './routes/loads';
import fmcsaRouter from './routes/fmcsa';
import callsRouter from './routes/calls';
import metricsRouter from './routes/metrics';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'HappyRobot Carrier Sales API'
  });
});

// API Routes
app.use('/api/loads', loadsRouter);
app.use('/api/fmcsa', fmcsaRouter);
app.use('/api/calls', callsRouter);
app.use('/api/metrics', metricsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HappyRobot Carrier Sales API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Load search: POST http://localhost:${PORT}/api/loads/search`);
  console.log(`✅ MC verification: POST http://localhost:${PORT}/api/fmcsa/verify`);
  console.log(`📞 Call recording: POST http://localhost:${PORT}/api/calls/record`);
  console.log(`📈 Metrics: GET http://localhost:${PORT}/api/metrics`);
});

export default app;
