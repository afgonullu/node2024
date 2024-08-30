import express from 'express';
import YAML from 'yamljs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app: express.Application) {
  const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/swagger.yml')) as swaggerUi.SwaggerUiOptions;

  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
