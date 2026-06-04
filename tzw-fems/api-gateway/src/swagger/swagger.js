import swaggerUi from 'swagger-ui-express';
import express from 'express';
import axios from 'axios';

const router = express.Router();

const baseSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TZW LTD — Fire Extinguisher Management System API',
    version: '1.0.0',
    description: 'Unified API Documentation for all TZW LTD microservices routed through the API Gateway.'
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'API Gateway Entry Point'
    }
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {}
  }
};

// Route to fetch and compile all child specs dynamically
router.get('/json', async (req, res) => {
  const services = [
    { name: 'Auth', url: process.env.AUTH_SERVICE_URL || 'http://localhost:5001' },
    { name: 'Users', url: process.env.USER_SERVICE_URL || 'http://localhost:5002' },
    { name: 'Extinguishers', url: process.env.EXTINGUISHER_SERVICE_URL || 'http://localhost:5003' },
    { name: 'Inspections', url: process.env.INSPECTION_SERVICE_URL || 'http://localhost:5004' },
    { name: 'Reports', url: process.env.REPORT_SERVICE_URL || 'http://localhost:5005' },
    { name: 'Notifications', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5006' }
  ];

  const merged = JSON.parse(JSON.stringify(baseSpec));

  for (const s of services) {
    try {
      const response = await axios.get(`${s.url}/api-docs-json`, { timeout: 1500 });
      const spec = response.data;
      
      // Merge paths (filter out internal routes and combine)
      if (spec.paths) {
        Object.entries(spec.paths).forEach(([p, val]) => {
          if (p.startsWith('/api')) {
            merged.paths[p] = val;
          }
        });
      }

      // Merge schema component models
      if (spec.components && spec.components.schemas) {
        Object.entries(spec.components.schemas).forEach(([name, val]) => {
          merged.components.schemas[name] = val;
        });
      }
    } catch (err) {
      console.warn(`Could not load Swagger spec from ${s.name} at ${s.url}: ${err.message}`);
    }
  }

  res.json(merged);
});

// Configure Swagger UI to point to the unified JSON endpoint
const options = {
  swaggerOptions: {
    url: '/api-docs/json'
  }
};

router.use('/', swaggerUi.serve, swaggerUi.setup(null, options));

export default router;
