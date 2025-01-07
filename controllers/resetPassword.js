const crypto = require("crypto");
const nodemailer = require("nodemailer");
const catchAsync = require("../utils/catchAsync");
const user = require("../models/users");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_SMP_USERNAME,
    pass: process.env.GMAIL_SMP_PASSWORD,
  },
});

// Generate reset password token and send email
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError("Email is required", 400));
  }

  const forgotPasswordUser = await user.findOne({ where: { email } });

  if (!forgotPasswordUser || !forgotPasswordUser.isVerified) {
    return next(new ApiError("User not registered or verified", 404));
  }

  // Generate reset token
  const token = crypto.randomBytes(20).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour

  // Save token and expiration to user
  forgotPasswordUser.resetPasswordToken = token;
  forgotPasswordUser.resetPasswordExpires = expires;

  await forgotPasswordUser.save();

  // Send email
  const htmlContent = `
  <h6>clozagent agent reset password</h6>
  <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
  <p>Please click on the following link, or paste this into your browser to complete the process:</p>
  <p><a href='${req.protocol}://${req.get("host")}/user/reset-password/?token=${token}'>clozagent reset password link</a> it expires in <b>1 hour</b></p>
  <p>Copy the link to browser</p>
  <p>${req.protocol}://${req.get("host")}/user/reset-password/?token=${token}</p>
  <p><b>If you did not request this, please ignore this email and your password will remain unchanged.</b></p>`;

  const mailOptions = {
    from: process.env.GMAIL_SMP_USERNAME,
    to: email,
    subject: "clozagent Password Reset",
    html: htmlContent,
  };

  const result = await transporter.sendMail(mailOptions);

  if (!result) {
    return next(new ApiError("Failed to send email", 400));
  }

  return res.status(200).json({
    status: "success",
    message: "Reset password email sent, please check your email",
  });
});

// Reset password using token
const resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword, confirmNewPassword } = req.body;
  const { token } = req.query;

  const result = await user.findOne({
    where: {
      resetPasswordToken: token,
      resetPasswordExpires: {
        [Op.gt]: Date.now(),
      },
    },
  });

  if (!result) {
    return next(new ApiError("Invalid or expired token", 400));
  }

  // Confirm password
  if (newPassword !== confirmNewPassword) {
    return next(new ApiError("Password and confirm password must match", 400));
  }

  // Save new password
  result.password = newPassword;
  result.confirmPassword = confirmNewPassword;

  // Reset token
  result.resetPasswordToken = null;
  result.resetPasswordExpires = null;

  await result.save();

  res.status(200).json({
    status: "success",
    message: `Password has been reset for ${result.email}`,
  });
});

module.exports = { forgotPassword, resetPassword };
