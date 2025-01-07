require("dotenv").config({ path: `${process.cwd()}/.env` });
const { Sequelize } = require("sequelize");
const user = require("../models/users");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const post = require("../models/posts");

const createPost = catchAsync(async (req, res, next) => {
  const {
    postImageUrl,
    property,
    price,
    city,
    state,
    country,
    videoUrl,
  } = req.body;

  const newPost = await post.create({
    createdBy: req.user.id,
    property,
    price,
    city,
    state,
    country,
    postImageUrl,
    videoUrl,
  });

  if (!newPost) {
    return next(new ApiError("Failed to create post", 500));
  }

  return res.status(200).json({
    status: "success",
    message: "Post created successfully,",
    data: newPost
  });
});

const getPosts = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;

  const { rows, count } = await post.findAndCountAll({
    where: {
      createdBy: req.user.id,
    },
    order: [["createdAt", "DESC"]],
    limit: size,
    offset: (page - 1) * size,
    attributes: {
      exclude: [
        "deletedAt",
      ],
    },
  });

  return res.status(200).json({
    status: "success",
    message: "Posts profiles fetched successfully",
    count: count,
    data: rows,
  });
});

const getPostById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (id === ":id") {
    throw new ApiError("id must be provided", 400);
  }

  const result = await user.findByPk(id, {
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
        "password",
        "createdAt",
        "updatedAt",
        "deletedAt",
      ],
    },
  });

  if (!result) {
    return next(new ApiError(`user not found`, 404));
  }

  return res.status(200).json({
    status: "success",
    message: "user fetched successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const id = req.params.id;

  const {

  } = req.body;

  const gender = capitalizeFirstLetter(req.body.gender);

  if (userId !== id) {
    return next(new ApiError(`You can't modify another user's profile`, 400));
  }

  // update builder info
  const [updatedRow] = await user.update(
    {
      firstName,
      lastName,
      avatar,
      phoneNumber,
      bio,
      gender,
      occupation,
      yearsOfExperience,
      country,
      city,
      state,
    },
    {
      where: { id },
    },
  );

  if (updatedRow === 0) {
    return next(new ApiError(`user not found`, 404));
  }

  return res.json({
    status: "success",
    message: "user data updated successfully",
  });
});

const deletePostById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const userId = req.user.id;
  const email = req.user.email;

  if (userId !== id) {
    return next(new ApiError(`You can't modify another user's profile`, 400));
  }

  const result = await user.destroy({
    where: {
      id,
      email,
    },
    force: true,
  });

  if (!result) {
    return next(new ApiError(`Post not found`, 404));
  }

  return res.status(200).json({
    status: "success",
    message: "Profile deleted successfully",
    data: {},
  });
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePostById,
};
