import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fire Extinguisher Service',
      version: '1.0.0',
      description: 'TZW LTD Fire Extinguisher Management System — Fire Extinguisher Inventory Service API'
    },
    servers: [
      {
        url: 'http://localhost:5003',
        description: 'Direct Service'
      },
      {
        url: 'http://localhost:5000',
        description: 'API Gateway Proxy'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/routes/**/*.js']
};

export const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
