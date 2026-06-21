import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie & TV Catalog API',
      version: '1.0.0',
      description: 'API documentation for LK21 metadata catalog',
    },
    servers: [
      {
        url: '/api',
        description: 'Current Environment'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/docs/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
