import express from 'express';
import cors from 'cors';
import path from 'path';
import filesRouter from './routes/files';
import templatesRouter from './routes/templates';
import deployRouter from './routes/deploy';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', filesRouter);
app.use('/api', templatesRouter);
app.use('/api', deployRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      bpmnDir: process.env.BPMN_DIR,
      connectorsDir: process.env.CONNECTORS_DIR,
      camundaUrl: process.env.CAMUNDA_API_URL
    }
  });
});

// Serve static files (frontend build) in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public');
  app.use(express.static(publicPath));

  // SPA fallback - only for non-API routes
  app.get('*', (req, res, next) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
