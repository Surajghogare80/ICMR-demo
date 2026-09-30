
// src/server.js
import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import { warmUpRPredictionEngine } from './ai/predictionRouter.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDB();

    // Pre-load the R prediction engine's packages (jsonlite/randomForest/
    // xgboost) once now, so the first real screening submission doesn't pay
    // that cold-start cost and risk exceeding the frontend's request timeout.
    await warmUpRPredictionEngine();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 PRABHA API Server running on port ${PORT}`);
      logger.info(`📋 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🌐 Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown on unhandled rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
