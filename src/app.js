const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Configuración de las opciones de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'StudySync API',
      version: '1.0.0',
      description: 'Documentación del Sistema de coordinación de grupos de estudio',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://studysync-api-yd9y.onrender.com' 
          : 'http://localhost:3000',
        description: 'Servidor de desarrollo / producción',
      },
    ],
  },
  // Ruta a los archivos donde escribirás la documentación de los endpoints
  apis: ['./src/routes/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Ruta para la interfaz gráfica de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Tus rutas existentes
app.use('/api/sesiones', require('./routes/sesiones'));
app.use('/api/auth', require('./routes/auth'));

module.exports = app;