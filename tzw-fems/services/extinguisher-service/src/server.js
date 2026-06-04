import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import extRoutes from './routes/extinguishers.js';
import swaggerRouter, { swaggerSpec } from './swagger/swagger.js';
import { globalErrorHandler, sendSuccess } from 'shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  return sendSuccess(res, { status: 'UP', service: 'extinguisher-service' }, 'Fire Extinguisher Service is healthy');
});

// Swagger spec JSON endpoint (used by gateway aggregation)
app.get('/api-docs-json', (req, res) => {
  res.json(swaggerSpec);
});

// Swagger UI Route
app.use('/api-docs', swaggerRouter);

// Register routes
app.use('/', extRoutes);

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Fire Extinguisher Service running on port ${PORT}`);
});
