require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Swagger
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TukTuk Tracker API',
      version: '1.0.0',
      description: 'Real-Time Three-Wheeler Tracking System for Sri Lanka Police'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Vehicles', description: 'Vehicle management' },
      { name: 'Locations', description: 'GPS location tracking' },
      { name: 'Drivers', description: 'Driver management' },
      { name: 'Provinces', description: 'Province data' },
      { name: 'Districts', description: 'District data' },
      { name: 'Users', description: 'User management' }
    ],
    paths: {
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and get JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'admin@police.lk' },
                    password: { type: 'string', example: 'admin123' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Returns JWT token and role' },
            401: { description: 'Invalid credentials' }
          }
        }
      },
      '/api/provinces': {
        get: {
          tags: ['Provinces'],
          summary: 'Get all 9 provinces',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of all provinces' } }
        }
      },
      '/api/provinces/{id}/districts': {
        get: {
          tags: ['Provinces'],
          summary: 'Get districts in a province',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'List of districts' } }
        }
      },
      '/api/districts': {
        get: {
          tags: ['Districts'],
          summary: 'Get all 25 districts',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of districts' } }
        }
      },
      '/api/districts/{id}/stations': {
        get: {
          tags: ['Districts'],
          summary: 'Get police stations in a district',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'List of police stations' } }
        }
      },
      '/api/vehicles': {
        get: {
          tags: ['Vehicles'],
          summary: 'Get all registered tuk-tuks',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of vehicles' } }
        },
        post: {
          tags: ['Vehicles'],
          summary: 'Register a new tuk-tuk (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    registrationNumber: { type: 'string', example: 'WP-TUK-0201' },
                    licensePlate: { type: 'string', example: 'WP AB-1234' },
                    province: { type: 'string' },
                    district: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Vehicle created' } }
        }
      },
      '/api/vehicles/{id}': {
        get: {
          tags: ['Vehicles'],
          summary: 'Get a single vehicle by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Vehicle details' }, 404: { description: 'Not found' } }
        },
        put: {
          tags: ['Vehicles'],
          summary: 'Update a vehicle (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Vehicle updated' } }
        },
        delete: {
          tags: ['Vehicles'],
          summary: 'Deactivate a vehicle (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Vehicle deactivated' } }
        }
      },
      '/api/vehicles/{id}/location/latest': {
        get: {
          tags: ['Locations'],
          summary: 'Get last known location of a vehicle',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Latest location ping' }, 404: { description: 'No location found' } }
        }
      },
      '/api/vehicles/{id}/location/history': {
        get: {
          tags: ['Locations'],
          summary: 'Get movement history of a vehicle',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
            { in: 'query', name: 'startDate', schema: { type: 'string' }, example: '2026-04-20' },
            { in: 'query', name: 'endDate', schema: { type: 'string' }, example: '2026-04-27' }
          ],
          responses: { 200: { description: 'List of location pings' } }
        }
      },
      '/api/locations/ping': {
        post: {
          tags: ['Locations'],
          summary: 'Submit a GPS location ping from a tracking device',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    vehicleId: { type: 'string' },
                    longitude: { type: 'number', example: 79.8612 },
                    latitude: { type: 'number', example: 6.9271 },
                    speed: { type: 'number', example: 35 },
                    heading: { type: 'number', example: 90 }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Ping recorded' } }
        }
      },
      '/api/locations/active': {
        get: {
          tags: ['Locations'],
          summary: 'Get active vehicles with latest pings',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'province', schema: { type: 'string' } },
            { in: 'query', name: 'district', schema: { type: 'string' } }
          ],
          responses: { 200: { description: 'Active vehicles with latest location' } }
        }
      },
      '/api/drivers': {
        get: {
          tags: ['Drivers'],
          summary: 'Get all registered drivers',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of drivers' } }
        },
        post: {
          tags: ['Drivers'],
          summary: 'Register a new driver (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    nic: { type: 'string' },
                    licenseNumber: { type: 'string' },
                    phone: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'Driver created' } }
        }
      },
      '/api/drivers/{id}': {
        get: {
          tags: ['Drivers'],
          summary: 'Get a single driver by ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Driver details' } }
        }
      },
      '/api/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users (Admin only)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of users' } }
        },
        post: {
          tags: ['Users'],
          summary: 'Create a new officer account (Admin only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: { type: 'string', example: 'officer' }
                  }
                }
              }
            }
          },
          responses: { 201: { description: 'User created' } }
        }
      },
      '/api/users/{id}': {
        delete: {
          tags: ['Users'],
          summary: 'Delete a user (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'User deleted' } }
        }
      }
    }
  },
  apis: []
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
  const dbConnected = await connectDB({ retries: 5, baseDelayMs: 1000 });
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Database connected: ${dbConnected}`);
  });
};

start();