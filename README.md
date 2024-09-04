# Node.js TypeScript API Template

## Overview

This project is a robust Node.js API template using TypeScript, Express, and WebSocket. It's designed to provide a solid foundation for building scalable and maintainable backend applications.

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
- **Code Quality**: ESLint and Prettier for consistent code style.
- **Hot Reloading**: Nodemon for automatic server restarts during development.

## Project Structure

```
src/
├── clients/ # API clients (e.g., database clients)
├── controllers/ # Route handlers
├── interfaces/ # TypeScript interfaces
├── lib/ # Shared constants, functions, types
├── middlewares/ # Custom middlewares
├── models/ # Database models
├── services/ # Business logic
└── utils/ # Utility functions
```

## Getting Started

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required values

4. Run the development server:

   ```
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
   - Do not execute business logic in the controller, move it to the service

2. **Business Logic**:

   - Implement new services in `src/services/`
   - Keep controllers thin, move complex logic to services

3. **Database Models**:

   - Add new models in `src/models/`
   - Use TypeScript interfaces to define model structures

4. **Middleware**:

   - Create new middleware in `src/middlewares/`
   - Add to routes or app-wide in `src/index.ts`

5. **WebSocket Events**:

   - Extend `src/controllers/websocketServer.ts` for new real-time features

6. **API Documentation**:

   - Update `docs/swagger.yml` when adding or modifying endpoints

7. **Environment Variables**:

   - Add new variables to `src/lib/config.ts` and `.env`

8. **Error Handling**:

   - Create custom error classes in `src/lib/serverErrors.ts` as needed

9. **Testing**:

   - Add tests for new features (consider adding a testing framework)

10. **Continuous Integration**:
    - Update CI/CD pipelines when adding new build or deployment steps

Remember to maintain the existing code structure and follow the established patterns for consistency.
