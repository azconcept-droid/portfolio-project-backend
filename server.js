"use strict";

require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const bodyParser = require("body-parser");
const signupRouter = require("./routes/signupRoute");
const loginRouter = require("./routes/loginRoute");
const otpRouter = require("./routes/verifyEmailRoute");
const resetPasswordRouter = require("./routes/resetPasswordRoute");
const dashboardRouter = require("./routes/dashboardRoute");
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const globalErrorHandler = require("./utils/errorHandler");
const catchAsync = require("./utils/catchAsync");
const ApiError = require("./utils/apiError");
// require("./config/swagger");

const port = process.env.PORT || 4000; // Use the provided port from env or default to 3000

const app = express();

// Enable cors
app.use(cors());

// To parse json bodies
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// root endpoint
app.get("/api/v1/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to clozagent robust API.",
  });
});

// api status route
app.get("/api/v1/status", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "clozagent api status is okay",
  });
});

// signup endpoint
app.use("/api/v1", signupRouter);

// login endpoint
app.use("/api/v1", loginRouter);

// verify email endpoint
app.use("/api/v1", otpRouter);

// reset password endpoint
app.use("/api/v1", resetPasswordRouter);

// dashboard endpoints
app.use("/api/v1", dashboardRouter);

// users endpoint
app.use("/api/v1", userRouter);

// posts endpoint
app.use("/api/v1", postRouter);

// 404 route
app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new ApiError("Route not found", 404);
  }),
);

// Global error handler
app.use(globalErrorHandler);

// Sync the database and start the server
(async () => {
  // Check for environment-specific configurations
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    console.warn(
      "Warning: Running in production mode. Avoid using force: true for database synchronization.",
    );
    try {
      await sequelize.sync({ alter: true });
      console.log("Database synced!");

      // Start the server

      app.listen(port, () => {
        console.log(`clozagent server is running on port, ${port}`);
      });
    } catch (err) {
      console.log("Error syncing", err);
    }
  } else {
    try {
      // await sequelize.sync({ force: true });
      await sequelize.sync({ alter: true });
      console.log("Database synced!");

      // Start the server

      app.listen(port, () => {
        console.log(`Server is running on port, ${port}`);
      });
    } catch (err) {
      console.log("Error syncing", err);
    }
  }
})();
