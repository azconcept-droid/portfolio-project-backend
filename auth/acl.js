const ApiError = require("../utils/apiError");

const restrictTo = (...userType) => {
  const checkPermission = (req, res, next) => {
    if (!userType.includes(req.user.userType)) {
      return next(
        new ApiError("You don't have permission to perform this action", 403),
      );
    }
    return next();
  };

  return checkPermission;
};

module.exports = restrictTo;
