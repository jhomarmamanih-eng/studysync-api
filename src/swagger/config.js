
/*const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
        description: 'Servidor de despliegue',
      },
    ],
  },
  apis: [
    path.join(__dirname, '../swagger/*.js'),
    path.join(__dirname, '../routes/*.js')
  ], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;*/









// src/swagger/config.js
// ¿Qué hace este archivo?
// swagger-jsdoc lee los comentarios especiales de tus rutas (los @swagger)
// y genera automáticamente un documento JSON con la especificación OpenAPI 3.0.
// Ese documento es el que Swagger UI (la página web) va a renderizar.
const swaggerJsdoc = require('swagger-jsdoc');
const productionUrl = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://studysync-api-yd9y.onrender.com';
const opciones = {
// 'definition' describe tu API: nombre, versión, descripción y servidores
definition: {
openapi: '3.0.0', // Versión del estándar OpenAPI que usamos
info: {
title: 'StudySync API',
version: '1.0.0',
description:
'API REST para coordinación de grupos de estudio universitarios. ' +
'Sistema distribuido con notificaciones en tiempo real via Redis Pub/Sub.',
contact: {
name: 'M.Sc. Jimmy Nataniel Requena Llorentty',
email: 'docente@upds.edu'
}
},
// Servidores donde está disponible la API
// Swagger permite cambiar entre el servidor local y producción con un menú
servers: [
{
url: 'http://localhost:3000',
description: 'Desarrollo local'
},
{
url: productionUrl,
description: 'Producción (Render)'
}
],
// 'components' define elementos reutilizables
// BearerAuth: le dice a Swagger que esta API usa tokens JWT
// Cuando el usuario hace clic en "Authorize" e ingresa su token,
// Swagger lo incluye automáticamente en todas las peticiones que lo requieran
components: {
securitySchemes: {
BearerAuth: {
type: 'http',
scheme: 'bearer',
bearerFormat: 'JWT',
description: 'Ingresar el token JWT obtenido desde POST /auth/login'
}
}
}
},
// 'apis' indica dónde buscar los comentarios @swagger
// El patrón *.js con ** hace que busque en TODAS las subcarpetas de src/routes/
apis: ['./src/routes/*.js']
};
// swagger-jsdoc procesa los archivos indicados en 'apis',
// lee los comentarios @swagger y devuelve un objeto JSON con la especificación
module.exports = swaggerJsdoc(opciones);
