"use strict";

const ApiError = require("./apiError");

const sendErrorDev = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  res.status(statusCode).json({
    status,
    message,
    stack,
  });
};

const sendErrorProd = (error, res) => {
  const statusCode = error.statusCode || 500;
  const status = error.status || "error";
  const message = error.message;
  const stack = error.stack;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  // Log error to console
  console.log(error.name, error.message, stack);

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  if (err.name === "JsonWebTokenError") {
    err = new ApiError("Unauthorized! please login", 401);
  }

  if (err.name === "SequelizeValidationError") {
    err = new ApiError(err.errors[0].message, 400);
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    err = new ApiError(`Email or Profile already exit`, 409);
  }
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }
  sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
