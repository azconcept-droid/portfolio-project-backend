"use strict";

const user = require("../models/users");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const signup = catchAsync(async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if(!email || !password || !confirmPassword) {
		throw new ApiError("email and password is required", 400);
  }

  // check if user already exists
  const existingUser = await user.findOne({ where: { email }});

  if (existingUser) {
		return next(
			new ApiError("You already signed up, please login.", 409),
		);
	}

  const newUser = await user.create({
    email,
    password,
    confirmPassword
  }) 

  if (!newUser) {
    return next(new ApiError("Failed to create user", 500));
  }

  return res.status(200).json({
		status: "success",
		message: "Congratulations, you signed up successfully,",
	});
})

module.exports = { signup }
