// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
// Connect to DB before starting the server to avoid starting then exiting
// connectDB may call process.exit(1) on failure; awaiting prevents starting the server when DB is missing
// Note: connectDB returns a Promise
app.use(cors());
app.use(express.json());

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'TukTuk Tracker API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.js']
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/provinces', require('./src/routes/provinces'));
app.use('/api/districts', require('./src/routes/districts'));
app.use('/api/vehicles', require('./src/routes/vehicles'));
app.use('/api/drivers', require('./src/routes/drivers'));
app.use('/api/locations', require('./src/routes/locations'));
app.use('/api/users', require('./src/routes/users'));
app.use('/health', require('./src/routes/health'));

const start = async () => {
  // Try to connect to DB (with retries). Do not exit on failure; the app will still run and expose a /health endpoint.
  const dbConnected = await connectDB({ retries: 5, baseDelayMs: 1000 });

  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Database connected: ${dbConnected}`);
  });
};

start();
