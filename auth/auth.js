const jwt = require("jsonwebtoken");

const authentication = catchAsync(async (req, res, next) => {
	// 1. get the token from headers
	let idToken = "";
	const user = req.query.user;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		idToken = req.headers.authorization.split(" ")[1];
	}

	if (!idToken) {
		return next(new ApiError("Please login to get access", 401));
	}

	// 2. token verification
	const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET);

	// 3. get the user detail from db and add to req object
	const freshUser = await user.findByPk(tokenDetail.id);

	if (!freshUser) {
		return next(new ApiError("Unauthorized! please login", 401));
	}

	req.user = freshUser;

	return next();
});

module.exports = { authentication };
