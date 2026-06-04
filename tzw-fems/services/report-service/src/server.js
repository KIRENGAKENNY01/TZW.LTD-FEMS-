import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import reportRoutes from './routes/reports.js';
import swaggerRouter, { swaggerSpec } from './swagger/swagger.js';
import { globalErrorHandler, sendSuccess } from 'shared';

dotenv.config();

// Ensure public/exports directory exists
const exportsDir = path.join(process.cwd(), 'public', 'exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5005;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  return sendSuccess(res, { status: 'UP', service: 'report-service' }, 'Report Service is healthy');
});

// Swagger spec JSON endpoint (used by gateway aggregation)
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerSpec);
});

// Swagger UI Route
app.use('/api-docs', swaggerRouter);

// Register routes
app.use('/', reportRoutes);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Report Service running on port ${PORT}`);
});
