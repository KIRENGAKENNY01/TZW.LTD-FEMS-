import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import axios from 'axios';
import proxy from 'express-http-proxy';
import swaggerRouter from './swagger/swagger.js';
import { setupProxies } from './proxy.js';
import { sendSuccess, sendError } from 'shared';

dotenv.config();

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Apply Helmet with content security exceptions for Swagger UI style injection
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: true, // reflect request origin (allows all origins in dev)
  credentials: true,
}));
app.use(morgan('dev'));

// JSON specification proxying for Aggregated Swagger UI
const specRoutes = [
  { path: '/api-docs/auth-json', target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001' },
  { path: '/api-docs/users-json', target: process.env.USER_SERVICE_URL || 'http://localhost:5002' },
  { path: '/api-docs/extinguishers-json', target: process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003' },
  { path: '/api-docs/inspections-json', target: process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004' },
  { path: '/api-docs/reports-json', target: process.env.REPORT_SERVICE_URL || 'http://localhost:5005' },
  { path: '/api-docs/notifications-json', target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006' }
];

specRoutes.forEach(route => {
  app.use(route.path, proxy(route.target, {
    parseReqBody: false,
    proxyReqPathResolver: () => '/api-docs-json'
  }));
});

// Swagger UI aggregated documentation route
app.use('/api-docs', swaggerRouter);

// Gateway and services health endpoint
app.get('/health', async (req, res) => {
  const services = [
    { name: 'auth-service', url: process.env.AUTH_SERVICE_URL || 'http://localhost:5001' },
    { name: 'user-management-service', url: process.env.USER_SERVICE_URL || 'http://localhost:5002' },
    { name: 'extinguisher-service', url: process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003' },
    { name: 'inspection-service', url: process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004' },
    { name: 'report-service', url: process.env.REPORT_SERVICE_URL || 'http://localhost:5005' },
    { name: 'notification-service', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006' }
  ];

  const serviceStatuses = [];
  for (const s of services) {
    try {
      const start = Date.now();
      const response = await axios.get(`${s.url}/health`, { timeout: 1500 });
      serviceStatuses.push({
        name: s.name,
        status: response.data.data?.status || 'UP',
        latency: `${Date.now() - start}ms`
      });
    } catch (err) {
      serviceStatuses.push({
        name: s.name,
        status: 'DOWN',
        error: err.message
      });
    }
  }

  return sendSuccess(res, {
    status: 'ok',
    gatewayPort: PORT,
    services: serviceStatuses
  }, 'API Gateway and downstream services status');
});

// Setup proxy routers to downstream microservices
setupProxies(app);

// Fallback Route
app.use((req, res) => {
  return sendError(res, 'Route not found on Gateway', {}, 404);
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
