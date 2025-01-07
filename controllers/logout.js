const catchAsync = require("../utils/catchAsync");

const logout = catchAsync(async (req, res, next) => {
  // Inform the client to delete the token
  return res.status(200).json({
    status: "success",
    message: "logged out successfully",
  });
});

module.exports = { logout };
