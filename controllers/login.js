"use strict";

const bcrypt = require("bcrypt");
const user = require("../models/users");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const generateToken = require("../utils/generateToken");
const blog = require("../models/blogs");
const post = require("../models/posts");

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  const userLogin = await user.findOne({
    where: { email },
    include: [
      {
        model: blog,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
      {
        model: post,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
      },
    ],
    attributes: {
      exclude: [
        "resetPasswordToken",
        "resetPasswordExpires",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    },
  });

  if (!userLogin) {
    return next(new ApiError("User not found, please signup", 404));
  }

  const isPasswordMatched = await bcrypt.compare(password, userLogin.password);

  if (!userLogin || !isPasswordMatched) {
    return next(new ApiError("Incorrect email or password", 401));
  }

  const result = userLogin.toJSON();

  // if (result.isVerified === false) {
  //   return next(new ApiError("Please verify your email before login", 401));
  // }

  // generate auth-token
  const token = generateToken({
    id: result.id,
  });

  // don't return password
  delete result.password;

  return res.json({
    status: "success",
    message: "You logged in successfully",
    token,
    user: result,
  });
});

module.exports = { login };
