const { Sequelize } = require("sequelize");
const user = require("../models/users");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");
const catchAsync = require("../utils/catchAsync");
const blog = require("../models/blogs");
const ApiError = require("../utils/apiError");
const post = require("../models/posts");

const createUser = catchAsync(async (req, res, next) => {
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

const getUsers = catchAsync(async (req, res, next) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;

	const { rows, count } = await user.findAndCountAll({
		where: {
			userType: {
				[Sequelize.Op.ne]: "admin",
			},
		},
		order: [["createdAt", "DESC"]],
		limit: size,
		offset: (page - 1) * size,
		attributes: {
			exclude: [
				"password",
				"resetPasswordToken",
				"resetPasswordExpires",
				"deletedAt",
			],
		},
	});

	return res.status(200).json({
		status: "success",
		message: "Users profiles fetched successfully",
		count: count,
		data: rows,
	});
})

const getUserById = catchAsync(async (req, res, next) => {
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

const updateUser = catchAsync(async (req, res, next) => {
	const userId = req.user.id;
	const id = req.params.id;

  console.log(userId, id)
	const {
		firstName,
		lastName,
		avatar,
		phoneNumber,
    bio,
		occupation,
		yearsOfExperience,
		country,
		city,
    state,
	} = req.body;

	const gender = capitalizeFirstLetter(req.body.gender);

	if (userId !== id) {
		return next(
			new ApiError(`You can't modify another user's profile`, 400),
		);
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
		message: "user updated successfully",
	});
});

const deleteUserById = catchAsync(async (req, res, next) => {
	const id = req.params.id;
	const userId = req.user.id;
	const email = req.user.email;

	if (userId !== id) {
		return next(
			new ApiError(`You can't modify another user's profile`, 400),
		);
	}

	const result = await user.destroy({
		where: {
			id,
			email,
		},
		force: true,
	});

	if (!result) {
		return next(new ApiError(`User not found`, 404));
	}

	return res.status(200).json({
		status: "success",
		message: "Profile deleted successfully",
		data: {},
	});
});

module.exports = {
  createUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUserById,
};
