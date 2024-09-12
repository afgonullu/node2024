# Node.js TypeScript API Template: A Comprehensive Guide

## Overview

This guide walks you through the process of setting up a robust Node.js API using TypeScript. We'll cover everything from initial project setup to integrating advanced features like WebSockets and API documentation. By the end, you'll have a solid foundation for building scalable and maintainable backend applications.

You can test out the existing demonstrative API and websocket either via Postman or the Swagger UI.

## Features

- **TypeScript**: Full TypeScript support for enhanced developer experience and type safety.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **WebSocket Support**: Real-time, bidirectional and event-based communication.
- **Consistent Server Response**: Consistent server response, whether it is an error or a success.
- **Error Handling**: Centralized error handling, automatically catch errors and handle gracefully.
- **Extensible Custom Errors**: Extensible custom errors, you can create new errors and add new error codes, attach messages and metadata to existing errors.
- **Swagger Documentation**: API documentation using OpenAPI 3.0 specification.
- **Authentication**: JWT-based authentication middleware.
- **Logging**: Structured logging using Winston.
- **Environment Variables**: Secure configuration management.
- **Hot Reloading**: Nodemon for automatic server restarts during development.
- **Database**: Prisma as the database ORM.
- **Strong Linters**: ESLint and Prettier for consistent code style.

## Initial Setup

Let's start by initializing our project and setting up the basic structure.

- [ ] init

```bash
npm init -y
```

- [ ] Create a `.gitignore` file and add the following:

```json
/node_modules
```

- [ ] Install TypeScript and other dependencies

```bash
npm install --save-dev tsx nodemon typescript @types/node @swc/cli @swc/core
```

- [ ] Update your `package.json` scripts

```json
{
  // ..
  "scripts": {
    "tsc": "tsc",
    "build": "swc src -d build",
    "start": "node build/index.js",
    "dev": "nodemon --exec tsx src/index.ts",
    "type-check": "tsc --noEmit"
  }
  // ..
}
```

## TypeScript Configuration

- [ ] Initialize TypeScript configuration

```bash
npm run tsc -- --init
```

- [ ] Update `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "CommonJS",
    "lib": ["es2021"],
    "outDir": "./build/",
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "sourceMap": true,
    "baseUrl": "src",
    "paths": {
      "@controllers/*": ["controllers/*"],
      "@interfaces/*": ["interfaces/*"],
      "@lib/*": ["lib/*"],
      "@middlewares/*": ["middlewares/*"],
      "@models/*": ["models/*"],
      "@services/*": ["services/*"],
      "@clients/*": ["clients/*"],
      "@utils/*": ["utils/*"]
    }
  },
  "include": ["src/**/*"]
}
```

This configuration sets up TypeScript with strict type-checking and defines path aliases for easier imports.

## Linting and Formatting

Using airbnb's eslint config because it's a good default for a lot of rules that can be overridden as needed. We want a strict rule set to enforce consistency and teach us good practices.

- [ ] Install ESLint and Prettier

```bash
npx install-peerdeps --dev eslint-config-airbnb-base
```

```bash
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-airbnb-typescript eslint-plugin-import prettier eslint-config-prettier eslint-plugin-prettier prettier-plugin-organize-imports eslint-import-resolver-typescript"
```

- [ ] Create a `.eslintrc` file in the root directory with the following content:

```json
{
  "extends": [
    "airbnb-base",
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "prettier", "import"],
  "env": {
    "browser": true,
    "node": true,
    "mongo": true,
    "es2021": true
  },
  "rules": {
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/require-await": "off",
    "max-classes-per-file": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "settings": {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    }
  }
}
```

- [ ] Create a `.prettierrc` file in the root directory with the following content:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "bracketSpacing": true,
  "jsxBracketSameLine": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

- [ ] Update `package.json` scripts

```json
{
  // ...
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint --ext src/**/*.ts --fix",
    "prettier-format": "prettier --config .prettierrc 'src/**/*.ts' --write",
    "prepush": "npm run type-check && npm run lint && npm run prettier-format"
  }
  // ...
}
```

These scripts allow you to check types, lint your code, and format it with a single command.

## Express Server

Now that we have our project structure and code quality tools in place, let's set up our Express server.

- [ ] Install necessary packages

```bash
npm install express cors helmet morgan dotenv env-var express-async-errors winston jsonwebtoken
npm install --save-dev @types/express @types/cors @types/morgan @types/helmet @types/jsonwebtoken
```

- [ ] Create a `config.ts` file in the `lib` directory

```tsx
import { get } from 'env-var';

import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: get('PORT').required().asIntPositive(),
};

export default config;
```

- [ ] Create an `index.ts` file in the `src` directory

```tsx
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';

require('express-async-errors');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.listen(config.PORT, () => {
  console.log(config.PORT);
  console.log(`Server running on port ${config.PORT}`);
});
```

This sets up a basic Express server with some common middleware and a simple ping route.

## Logging with Winston

To improve our server's observability, let's implement a robust logging system using Winston.

- [ ] Create a `logger.ts` file in the `utils` directory

```jsx
import winston, { format } from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.colorize({ all: true }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
      ),
    }),
  ],
});

const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export { logger, stream };

```

- [ ] Update `index.ts` to use the logger

```jsx
app.use(morgan('combined', { stream }));
```

```jsx
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config';
import { logger, stream } from './utils/logger';

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
```

This setup provides detailed, colorized logs for better debugging and monitoring.

## Error Handling

Proper error handling is crucial for a robust API. Let's implement a centralized error handling system.

- [ ] Create a `serverInterfaces.ts` file in the `interfaces` directory

```jsx
import { Request, Response } from 'express';

interface ExtendedRequest extends Request {
  role?: UserRole;
  user?: string;
  userId?: string;
  sessionData?: {
    lastActive: Date;
    ipAddress: string;
  };
  context?: {
    requestId: string;
    startTime: number;
  };
  locals?: {
    [key: string]: unknown;
  };
  permissions?: string[];
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

interface JWTPayload {
  role: UserRole;
  user: string;
}

type ServerResponse<T = Record<string, unknown>> = {
  status: number;
  success: boolean;
  message: string;
  data: T;
};

class ServerError<T = Record<string, unknown>> extends Error implements ServerResponse<T> {
  constructor(
    public status: number,
    public success: boolean,
    public message: string,
    public data: T,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.success = success;
    this.message = message;
    this.data = data;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

type ExtendedResponse<T> = Response<ServerResponse<T>>;

export { ServerResponse, ServerError, UserRole, ExtendedRequest, JWTPayload, ExtendedResponse, ExtendedWebSocket };

```

- [ ] Create a `serverErrors.ts` file in the `lib` directory

```jsx
import { ServerError } from '../interfaces/serverInterfaces';

class BadRequestError extends ServerError {
  constructor(message = 'Bad Request', data: Record<string, unknown> = {}) {
    super(400, false, message, data);
  }
}

class UnauthenticatedError extends ServerError {
  constructor(message = 'Authentication Credentials are not valid', data: Record<string, unknown> = {}) {
    super(401, false, message, data);
  }
}

class NotFoundError extends ServerError {
  constructor(message = 'Resource not found', data: Record<string, unknown> = {}) {
    super(404, false, message, data);
  }
}

class InternalServerError extends ServerError {
  constructor(message = 'Internal Server Error', data: Record<string, unknown> = {}) {
    super(500, false, message, data);
  }
}

class UnavailableError extends ServerError {
  constructor(message = 'Service is currently unavailable', data: Record<string, unknown> = {}) {
    super(503, false, message, data);
  }
}

class InvalidJSONPayloadError extends ServerError {
  constructor(message = 'Invalid JSON payload', data: Record<string, unknown> = {}) {
    super(400, false, message, data);
  }
}

export {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  InternalServerError,
  UnavailableError,
  InvalidJSONPayloadError,
};

```

- [ ] Create an `errorHandler.ts` file in the `middlewares` directory

```jsx
import { NextFunction, Request, Response } from 'express';
import { ServerError, ServerResponse } from '@interfaces/serverInterfaces';
import { logger } from '@utils/logger';

const errorHandler = (err: ServerError, _req: Request, res: Response<ServerResponse>, next: NextFunction): void => {
  if (err instanceof ServerError) {
    res.status(err.status).json({
      status: err.status,
      success: err.success,
      message: err.message,
      data: err.data,
    });
  } else {
    // Handle unexpected errors
    logger.error('Error is not a server error, please use the server error class');
    res.status(500).json({
      status: 500,
      success: false,
      message: 'An unexpected error occurred',
      data: {},
    });
  }

  next(err);
};

export default errorHandler;

```

- [ ] Create an `unknownEndpoint.ts` file in the `middlewares` directory

```jsx
import { NextFunction, Request, Response } from 'express';

const unknownEndpoint = (_req: Request, res: Response, next: NextFunction): void => {
  res.status(404).send({ error: 'unknown endpoint' });
  next();
};

export default unknownEndpoint;

```

- [ ] Update `index.ts` to use the error handler and unknown endpoint middleware

```jsx
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config';
import { logger, stream } from './utils/logger';
import { errorHandler, unknownEndpoint } from './middlewares';

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
```

This setup provides a centralized error handling mechanism, making it easier to manage and respond to errors consistently across your application. Notice that the ServerResponse and ServerError interfaces are used throughout the application to ensure consistency and type safety. Also they have the same structure so using them on client side is streamlined and no surprises and deviations between endpoints or responses.

## Controller Setup

Now that we have our basic server and error handling in place, let's set up our controllers and routes.

- [ ] Create a `controllers` directory
- [ ] Create an `admin` directory in the `controllers` directory

- [ ] Update `config.ts` file in the `lib` directory

```jsx
import { get } from 'env-var';

import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: get('PORT').required().asIntPositive(),
  SUPER_ADMIN_PASSWORD: get('SUPER_ADMIN_PASSWORD').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),
};

export default config;
```

- [ ] Create an `authMiddleware.ts` file in the `middlewares` directory

```jsx
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest, JWTPayload } from '@interfaces/serverInterfaces';
import { UnauthenticatedError } from '@lib/serverErrors';
import config from '@lib/config';

const { JWT_SECRET } = config;

const authMiddleware = async (req: ExtendedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new UnauthenticatedError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.role = decoded.role;
    req.user = decoded.user;
  } catch (error) {
    throw new UnauthenticatedError('Invalid token');
  }

  next();
};

export default authMiddleware;

```

- [ ] Create an `index.ts` file in the `controllers` directory

```jsx
import express from 'express';
import adminRouter from './admin';

const router = express.Router();

// Admin API (protected, except for login)
router.use('/api/admin', adminRouter);

export default router;
```

- [ ] Create an `index.ts` file in the `controllers/admin` directory

```jsx
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import demoRouter from '@controllers/admin/demo';
import config from '@lib/config';
import { UnauthenticatedError } from '@lib/serverErrors';
import { ExtendedRequest, UserRole } from '@interfaces/serverInterfaces';
import { authMiddleware } from '@middlewares/index';

const { SUPER_ADMIN_PASSWORD, JWT_SECRET } = config;

const adminController = {
  getAdmin: (_req: ExtendedRequest, res: Response) => {
    res.json({ message: 'Hello, world!' });
  },
  login: (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string; password: string };

    const isSuperAdmin = username === 'admin' && password === SUPER_ADMIN_PASSWORD;

    if (isSuperAdmin) {
      const token = jwt.sign({ role: UserRole.SUPER_ADMIN, user: username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      throw new UnauthenticatedError('You are not authorized to access this resource');
    }
  },
};

const adminRouter = express.Router();

adminRouter.get('/', adminController.getAdmin);
adminRouter.post('/login/', adminController.login);

adminRouter.use('/demo', authMiddleware, demoRouter);

export default adminRouter;

```

- [ ] Create a `demo.ts` file in the `controllers/admin` directory

```jsx
import express, { Request, Response } from 'express';
import { logger } from '@utils/logger';
import { InternalServerError } from '@lib/serverErrors';
import { ExtendedRequest, ExtendedResponse } from '@interfaces/serverInterfaces';

const demoController = {
  getDemo: async (_req: Request, res: ExtendedResponse<{ name: string }>) => {
    logger.info('Demo route accessed');
    res.json({ status: 200, success: true, message: 'Demo route accessed', data: { name: 'Hi' } });
  },
  getDemoError: async () => {
    throw new InternalServerError('Demo route error');
  },
  getDemoUser: async (req: ExtendedRequest, res: Response) => {
    res.json({ user: req.user, role: req.role });
  },
};

const demoRouter = express.Router();

demoRouter.get('/', demoController.getDemo);
demoRouter.get('/error', demoController.getDemoError);
demoRouter.get('/get-user', demoController.getDemoUser);

export default demoRouter;

```

- [ ] Update `index.ts` to use the controllers

```jsx
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config';
import routes from './controllers';
import { logger, stream } from './utils/logger';
import { errorHandler, unknownEndpoint } from './middlewares';

const app = express();

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.use(routes);

app.use(unknownEndpoint);

app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
```

You now have a basic server setup with a REST API. You have a way to create a token and use that token to authenticate and authorize access to your API. Check out the postman collection in the repo to test the API when there is no token, when there is a wrong token, and other scenarios.

## Websocket Setup

WebSocket support allows for real-time, bidirectional communication between the server and clients. Let's set up the WebSocket server. It is essential for any AI applications with a chat UI.

- [ ] Install `ws` and `@types/ws` packages

```jsx
npm install ws
npm install --save-dev @types/ws
```

- [ ] Update `serverInterfaces.ts`

```jsx
import { WebSocket } from 'ws';

interface WebSocketMetadata {
  user: string;
  role: UserRole;
}

interface ExtendedWebSocket extends WebSocket {
  metadata?: WebSocketMetadata;
}
```

- [ ] Create a `websocketServer.ts` file in the `controllers` directory

```jsx
import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import { Response } from 'express';
import { logger } from '../utils/logger';
import config from '../lib/config';
import { authMiddleware } from '../middlewares';
import { ExtendedRequest, ExtendedWebSocket } from '../interfaces/serverInterfaces';

const setupWebSocketServer = (server: HttpServer) => {
  logger.info('Setting up WebSocket server on /ws');

  const wss = new WebSocketServer({
    server,
    path: config.WS_PATH,
    verifyClient: async (info, callback) => {
      try {
        // Apply authentication middleware
        await authMiddleware(info.req as ExtendedRequest, {} as Response, () => {});
        callback(true);
      } catch (error) {
        logger.error('WebSocket authentication failed:', error);
        callback(false, 401, 'Unauthorized');
      }
    },
  });

  wss.on('connection', (ws: ExtendedWebSocket, req: ExtendedRequest) => {
    logger.info(`New WebSocket connection on ${config.WS_PATH}`);

    const wsx = ws;

    if (!req.user || !req.role) {
      logger.error('User or role not found in request');
      wsx.close(4000, 'User or role not found in request');
      return;
    }

    wsx.metadata = {
      user: req.user,
      role: req.role,
    };

    wsx.on('message', (message: string) => {
      if (!wsx.metadata) {
        logger.error('WebSocket metadata not found');
        wsx.close(4000, 'WebSocket metadata not found');
        return;
      }

      logger.info(`Received: ${message} from ${wsx.metadata.user}`);
      wsx.send(`Server received: ${message} from ${wsx.metadata.user}`);
    });

    wsx.on('error', (error) => {
      logger.error('WebSocket error:', error);
    });

    wsx.on('close', () => {
      logger.info('WebSocket connection closed');
    });
  });

  return wss;
};

export default setupWebSocketServer;
```

This setup creates a WebSocket server that authenticates connections using the same middleware as the REST API and handles basic message events. This is a basic setup and can be expanded with more features as needed. We will expand on this in the future.

- [ ] Update `index.ts` to set up the WebSocket server

```jsx
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './lib/config';
import routes from './controllers';
import { logger, stream } from './utils/logger';
import { errorHandler, unknownEndpoint } from './middlewares';
import { createServer } from 'http';
import setupWebSocketServer from './controllers/websocketServer';

const app = express();
const server = createServer(app);

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.use(routes);

// Set up WebSocket server
setupWebSocketServer(server);

app.use(unknownEndpoint);

app.use(errorHandler);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
```

## Swagger Docs Setup

Swagger provides a way to document your API endpoints. Let's set up Swagger UI for our API.

- [ ] Install `swagger-ui-express` and `yamljs` packages

```jsx
npm install swagger-ui-express yamljs
npm i --save-dev @types/yamljs @types/swagger-ui-express
```

- [ ] Create a `swagger.ts` file in the `controllers` directory

```jsx
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
```

- [ ] Create a `swagger.yml` file in the `docs` directory

```yaml
openapi: '3.0.3'
info:
  title: Node API 2024
  version: '1.0'
servers:
  - url: http://localhost:3000

tags:
  - name: Admin
    description: Admin-related operations
  - name: Demo
    description: Demo routes for testing and examples
  - name: System
    description: System-related operations

paths:
  /api/admin:
    get:
      summary: Get admin welcome message
      tags:
        - Admin
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: 'Hello, world!'

  /api/admin/login:
    post:
      summary: Admin login
      tags:
        - Admin
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
              required:
                - username
                - password
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
        '401':
          description: Unauthorized

  /api/admin/demo:
    get:
      summary: Access demo route
      tags:
        - Demo
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  status:
                    type: integer
                    example: 200
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: 'Demo route accessed'
                  data:
                    type: object
                    properties:
                      name:
                        type: string
                        example: 'Hi'

  /api/admin/demo/error:
    get:
      summary: Trigger a demo error
      tags:
        - Demo
      security:
        - BearerAuth: []
      responses:
        '500':
          description: Internal Server Error

  /api/admin/demo/get-user:
    get:
      summary: Get user information
      tags:
        - Demo
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    type: string
                  role:
                    type: string

  /ping:
    get:
      summary: Ping the server
      tags:
        - System
      responses:
        '200':
          description: Successful response
          content:
            text/plain:
              schema:
                type: string
                example: 'pong'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Error:
      type: object
      properties:
        error:
          type: string
```

- [ ] Update `index.ts` to set up Swagger

```jsx
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import config from './lib/config';
import routes from './controllers';
import { logger, stream } from './utils/logger';
import { errorHandler, unknownEndpoint } from './middlewares';
import setupWebSocketServer from './controllers/websocketServer';
import setupSwagger from './controllers/swagger';

const app = express();
const server = createServer(app);

app.use(helmet());
app.use(morgan('combined', { stream }));
app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => {
  logger.info('someone pinged here');
  res.send('pong');
});

app.use(routes);

// Setup Swagger
setupSwagger(app);

// Set up WebSocket server
setupWebSocketServer(server);

app.use(unknownEndpoint);

app.use(errorHandler);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  logger.info(`Swagger UI available at http://localhost:${config.PORT}/api-docs`);
});
```

## Prisma and Database Connection

Prisma is an ORM that simplifies database operations. Let's set up Prisma for our project.

- [ ] Install `prisma` and `@prisma/client` packages

```bash
npm install prisma @prisma/client
```

- [ ] Create a `prisma.ts` file in the `lib` directory

```jsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

- [ ] Change schema in `prisma/schema.prisma`
- [ ] Run `npx prisma migrate dev`

## AI agent pipeline, workers, agents

This section of the API implements an AI agent pipeline for generating haikus using LangChain and Anthropic's Claude model. The system is designed with a modular approach, utilizing separate agents for different tasks and a state graph to manage the flow of information.

### Structure

The AI components are organized into the following structure:

```plaintext
src/
├── agents/: Individual AI agents for specific tasks
├── flows/: Workflow definitions using LangChain's StateGraph
├── graphs/: State definitions for the workflows
├── index.ts: Entry point for AI functionalities
```

- [ ] Create a `haiku.graph.ts` file in the `graphs` directory

```typescript
import { Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';

const HaikuFlowState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),
  suggestedWord: Annotation<string>(),
  haiku: Annotation<string>(),
});

export default HaikuFlowState;
```

- [ ] Create a `haikuAgent.ts` file in the `agents` directory

```typescript
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import HaikuFlowState from '../graphs/haiku.graph';

const model = new ChatAnthropic({
  modelName: 'claude-3-haiku-20240307',
  temperature: 0.7,
});

const haikuPrompt = ChatPromptTemplate.fromTemplate(
  `For given messages, create a haiku.
  Messages: {messages}
  Include the word chosen by the user.
  Also include the word: {suggestedWord}
  Respond with only the haiku, no additional text.`,
);

const chain = haikuPrompt.pipe(model);

const createHaiku = async (state: typeof HaikuFlowState.State) => {
  const messages = state.messages.map((message) => message.content).join('\n');
  const response = await chain.invoke({
    messages,
    suggestedWord: state.suggestedWord,
  });
  return { haiku: response.content };
};

export default createHaiku;
```

- [ ] Create a `findWord.ts` file in the `agents` directory

```typescript
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import HaikuFlowState from '../graphs/haiku.graph';

const model = new ChatAnthropic({
  modelName: 'claude-3-haiku-20240307',
  temperature: 0.7,
});

const wordFinderPrompt = ChatPromptTemplate.fromTemplate(
  `Based on the following message history, suggest an appropriate and interesting word that could be used in a haiku: "{messages}"
  Respond with only the word, No Haiku, No additional text.`,
);

const chain = wordFinderPrompt.pipe(model);

const findWordModel = async (state: typeof HaikuFlowState.State) => {
  const messages = state.messages.map((message) => message.content).join('\n');
  const response = await chain.invoke({ messages });

  const suggestedWord = response.content;

  return { suggestedWord };
};

export default findWordModel;
```

- [ ] Create a `haikuFlow.ts` file in the `flows` directory

```typescript
import { MemorySaver, StateGraph } from '@langchain/langgraph';
import { AIMessage } from '@langchain/core/messages';
import { createHaiku, findWord } from 'llm/agents';
import HaikuFlowState from '../graphs/haiku.graph';

// Define the function to format the response
const formatResponse = async (state: typeof HaikuFlowState.State) => {
  const { haiku, suggestedWord } = state;
  const formattedResponse = `I've chosen the word "${suggestedWord}" for your haiku. Here it is:\n\n${haiku}`;
  return { messages: [new AIMessage(formattedResponse)] };
};

// Create the graph
const workflow = new StateGraph(HaikuFlowState)
  .addNode('find_word', findWord)
  .addNode('create_haiku', createHaiku)
  .addNode('format_response', formatResponse)
  .addEdge('__start__', 'find_word')
  .addEdge('find_word', 'create_haiku')
  .addEdge('create_haiku', 'format_response')
  .addEdge('format_response', '__end__');

const checkPointer = new MemorySaver();

// Compile the graph
const haikuFlow = workflow.compile({
  checkpointer: checkPointer,
});

export default haikuFlow;
```

### Workflow

The haiku generation workflow is defined in `flows/haikuFlow.ts`. It uses LangChain's StateGraph to create a pipeline with the following steps:

- Find a word (findWord agent)
- Create a haiku (createHaiku agent)
- Format the response

The workflow is compiled and exported as `haikuFlow`.

### Usage

The main entry point for the AI functionality is `src/llm/index.ts`. It exports a `generateHaiku` function that takes a message as input and returns the generated haiku.

To use the haiku generation in your API or WebSocket server:

```typescript
import flows from './llm';

// In your route handler or controller
const haiku = await flows.generateHaiku(userMessage);
```

### Extensibility

This structure allows for easy extension of AI capabilities:

- Add new agents in the agents directory
- Define new state graphs in the graphs directory
- Create new workflows in the flows directory
- Export new functions in index.ts

By following this pattern, you can add more AI-powered features to your API, such as text summarization, sentiment analysis, or other language tasks.

## Stripe Integration
