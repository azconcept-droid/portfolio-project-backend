require("dotenv").config({ path: `${process.cwd()}/.env` });
const { Sequelize } = require("sequelize");
const user = require("../models/users");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/apiError");
const post = require("../models/posts");
const blog = require("../models/blogs");

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
    message: "Posts fetched successfully",
    count: count,
    data: rows,
  });
});

const getPostsByUserId = catchAsync(async (req, res, next) => {
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
    message: "Posts fetched successfully",
    count: count,
    data: rows,
  });
});

const getPostById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (id === ":id") {
    throw new ApiError("id must be provided", 400);
  }

  const result = await post.findByPk(id, {
    attributes: {
      exclude: [
        "deletedAt",
      ],
    },
  });

  if (!result) {
    return next(new ApiError(`post not found`, 404));
  }

  return res.status(200).json({
    status: "success",
    message: "post fetched successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const {
    postImageUrl,
    property,
    price,
    city,
    state,
    country,
    videoUrl,
  } = req.body;
  // update builder info
  const [updatedRow] = await post.update(
    {
      postImageUrl,
      property,
      price,
      city,
      state,
      country,
      videoUrl,
    },
    {
      where: { id },
    },
  );

  if (updatedRow === 0) {
    return next(new ApiError(`post not found`, 404));
  }

  return res.json({
    status: "success",
    message: "post data updated successfully",
  });
});

const deletePostById = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const result = await post.destroy({
    where: {
      id,
    },
    force: true,
  });

  if (!result) {
    return next(new ApiError(`Post not found`, 404));
  }

  return res.status(200).json({
    status: "success",
    message: "post deleted successfully",
    data: {},
  });
});

module.exports = {
  createPost,
  getPosts,
  getPostsByUserId,
  getPostById,
  updatePost,
  deletePostById,
};
