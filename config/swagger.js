import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Unified Event Analytics Engine for Web and Mobile Apps - AnalytixHub',
        version: '1.0.0',
        description: "API documentation for the Website AnalytixHub platform"
    },
    servers: [
        {
            url: "http://localhost:8000",
            description: "Development Server"
        }
    ]
};

// Ensure correct path for routes
const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, "../routes/*.js")] // Use absolute path
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
