const blog = require("../models/blogs");
const post = require("../models/posts");
const user = require("../models/users");
const ApiError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

const dashboard = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const userDashboard = await user.findByPk(userId, {
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
        "password",
        "subscribed",
        "isVerified",
        "resetPasswordToken",
        "resetPasswordExpires",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    },
  });

  if (!userDashboard) {
    return next(new ApiError("Unauthorized! please login", 401));
  }

  const result = userDashboard.toJSON();

  return res.status(200).json({
    status: "success",
    message: `Hi 👋 ${result.firstName}, welcome to your dashboard!`,
    data: result,
  });
});

module.exports = { dashboard };
