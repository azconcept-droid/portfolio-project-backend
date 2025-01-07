// configure swagger api documention
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const app = require("../server");

let servers = [];

if (process.env.NODE_ENV === "developement") {
  servers = [
    {
      url: "https://backend-new-dev-test.onrender.com/api/v1/",
      description: "Development server",
    },
  ];
} else if (process.env.NODE_ENV === "production") {
  servers = [
    {
      url: "https://backend-new-b331.onrender.com/api/v1/",
      description: "Production Server",
    },
  ];
} else {
  servers = [
    {
      url: `http://localhost:${process.env.APP_PORT}/api/v1`,
      description: "local server",
    },
  ];
}

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Clozagent Backend API",
    version: "1.0.0",
    description: "This is a REST API application made with Express.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "JSONPlaceholder",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  components: {
    securitySchemes: {
      Authorization: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        value: "Bearer <JWT token here>",
      },
    },
  },
  servers: servers,
};

const routesUrl = path.join(__dirname, "route", "*.js");

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [routesUrl],
};

const swaggerSpec = swaggerJSDoc(options);

// Swagger Open API Documentation endpoint
app.use(
  "/api/v1/swagger/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
