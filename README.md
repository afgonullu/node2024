# Node.js TypeScript API Template

## Overview

This project is a robust Node.js API template using TypeScript, Express, and WebSocket. It's designed to provide a solid foundation for building scalable and maintainable backend applications.

You can test out the existing demonstrative API and websocket either via Postman or the Swagger UI.

## Features

- **AI**: LangChain for AI workflows.
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
- **Code Quality**: ESLint and Prettier for consistent code style.
- **Hot Reloading**: Nodemon for automatic server restarts during development.
- **Database**: Prisma as the database ORM.
- **Strong Linters**: ESLint and Prettier for consistent code style.

## Project Structure

```plaintext
src/
├── clients/ # API clients (e.g., database clients)
├── controllers/ # Route handlers
├── interfaces/ # TypeScript interfaces
├── lib/ # Shared constants, functions, types
├── middlewares/ # Custom middlewares
├── models/ # Database models
├── services/ # Business logic
├── utils/ # Utility functions
└── llm/ # LangChain AI workflows: agents, flows, graphs, etc.
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required values

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Access the API at `http://localhost:3000`
6. View Swagger documentation at `http://localhost:3000/api-docs`

## Available Scripts

- `npm run dev`: Start the development server with hot reloading
- `npm run build`: Build the project
- `npm start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run prettier-format`: Format code with Prettier
- `npm run type-check`: Run TypeScript type checking

## WebSocket Endpoint

This template includes WebSocket support for real-time, bidirectional communication. The WebSocket server is set up in `src/controllers/websocketServer.ts`.

- **WebSocket Path**: The WebSocket endpoint is configured using the `WS_PATH` environment variable. By default, it's set to `/ws`.
- **Authentication**: WebSocket connections are authenticated using the same JWT-based authentication as the REST API.
- **Connection**: To connect to the WebSocket server, use:

  ```javascript
  const socket = new WebSocket('ws://localhost:3000/ws');
  ```

  Remember to include the authentication token in the connection request.

- **Events**:
  - On connection: The server logs the new connection and sets up user metadata.
  - On message: The server echoes back the received message along with the user information.
  - On error: The server logs any WebSocket errors.
  - On close: The server logs when a connection is closed.

To expand WebSocket functionality:

1. Modify `src/controllers/websocketServer.ts` to add new event handlers or change existing ones.
2. Update the `ExtendedWebSocket` interface in `src/interfaces/serverInterfaces.ts` if you need to add more metadata to the WebSocket connection.
3. Implement client-side WebSocket handling in your frontend application to interact with these endpoints.

## Expanding the Codebase

To expand on the current codebase, follow these guidelines:

1. **New Routes**:

   - Add new route files in `src/controllers/`
   - Update `src/controllers/index.ts` to include new routes
   - Do not execute business logic in the controller, move it to a service

2. **AI**:

   - Add new agents, flows, graphs in `src/llm/`
     - Agents are the LLM agents that are used to generate responses
     - Flows are the LLM workflows that are used to generate responses, they can utilize agents, tools, and other resources
     - Graphs are the LLM state graphs that are used to generate responses, they are used to track the state of the LLM

3. **Business Logic**:

   - Implement new services in `src/services/`
   - Keep controllers thin, move complex logic to services

4. **Database Models**:

   - Add models in `prisma/schema.prisma` and
   - Run `npx prisma migrate dev --name <migration-name>` to create a new migration

5. **Middleware**:

   - Create new middleware in `src/middlewares/`
   - Add to routes or app-wide in `src/index.ts`

6. **API Documentation**:

   - Update `docs/swagger.yml` when adding or modifying endpoints

7. **Environment Variables**:

   - Add new variables to `src/lib/config.ts` and `.env`

8. **Error Handling**:

   - Create custom error classes in `src/lib/serverErrors.ts` as needed

Remember to maintain the existing code structure and follow the established patterns for consistency.

## Extending and Using Prisma and DB Client

I prefer Postgres, but you can use any other database supported by Prisma. Check their documentation or you can always ask me as well.

1. Change the schema in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name <migration-name>` to create a new migration.
   - This will create a new migration file in `prisma/migrations/<timestamp>_<migration-name>`
   - This will also generate and update the prisma client
3. Use the Prisma client in your services. For example:

```typescript
import prisma from '@clients/prisma';

const user = await prisma.user.findUnique({
  where: { id: 1 },
});
```
