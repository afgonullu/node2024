import express from 'express';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

const setupSwagger = (app: express.Application) => {
  const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/swagger.yml')) as swaggerUi.SwaggerUiOptions;

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
