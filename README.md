# Connect Backend

A TypeScript-based Express skeleton configured for the Connect backend services. It ships with the dependencies defined in `package.json`, a basic application structure, and convenience scripts for development and production builds.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust values as needed.
3. Start the development server with auto-reload:
   ```bash
   npm run dev
   ```
4. Build the project for production:
   ```bash
   npm run build
   ```
5. Run the compiled output:
   ```bash
   npm start
   ```

## Project Structure

```
src/
  app.ts               # Express app configuration
  index.ts             # HTTP server bootstrap
  config/
    environment.ts     # Environment variable loading
    logger.ts          # Winston logger configuration
  middleware/
    error-handler.ts   # Not found & error handlers
  routes/
    health.route.ts    # Health-check endpoint
    index.ts           # Route registration
```

Extend the `routes` directory with domain-specific modules and register them through `registerRoutes()`.
