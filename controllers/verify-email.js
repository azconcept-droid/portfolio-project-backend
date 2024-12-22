"use strict"

const nodemailer = require("nodemailer");
const ApiError = require("../utils/apiError");
const generateOTP = require("../utils/generateOtp");
const user = require("../models/users");
const otp = require("../models/otps");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");

// Email carrier
const emailCarrier = nodemailer.createTransport({
	service: "Gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.GMAIL_SMP_USERNAME,
		pass: process.env.GMAIL_SMP_PASSWORD,
	},
});

// Send otp to user email for signup process
const sendOtp = catchAsync(async (req, res, next) => {
	const { email } = req.body;

	if (!email) {
		return next(new ApiError("Please provide email", 400));
	}

	// Generate otp
	const otpNew = generateOTP();

	if (!otpNew) {
		return next(new ApiError("OTP generation failed", 400));
	}

	// Send mail options function
	const mailOptions = () => {
		const subject = "clozagent email verification";
		const htmlContent = `
      <p>Your one time password (OTP) is: <b>${otpNew}.</b></p>
      <p>Please kindly use this code to verify your email.</p>
      <p>Expires in 10 minutes.</p>`;

		return {
			from: process.env.GMAIL_SMP_USERNAME,
			to: email,
			subject,
			html: htmlContent,
		};
	};

	const userOtp = await otp.create({ email, otp: otpNew });

	if (!userOtp) {
		return next(new ApiError("failed to create OTP", 500));
	}

	const result = await emailCarrier.sendMail(mailOptions());

	if (!result) {
		return next(
			new ApiError("Failed to send OTP, service unavailable", 503),
		);
	}

	return res.status(200).json({
		status: "success",
		message: "OTP sent successfully, check your mail.",
	});
});

const verifyOtp = catchAsync(async (req, res, next) => {
	const { email, token } = req.body;

	const otpRecord = await otp.findOne({
		where: {
			email,
			otp: token,
			createdAt: {
				[Op.gt]: new Date(new Date() - 10 * 60 * 1000), // OTP valid for 10 minutes
			},
		},
	});

	if (!otpRecord) {
		await otp.destroy({ where: { email, otp: token } });
		return next(new ApiError("Invalid or expired token", 400));
	}

	const userRecord = await user.findOne({ where: { email } });

	if (!userRecord) {
		return next(new ApiError("User not found, please register", 404));
	}

	userRecord.isVerified = true;

	// Save in database
	await userRecord.save();

	await otp.destroy({ where: { email, otp: token } });

	return res.status(200).json({
		status: "success",
		message: `Email verified successfully for ${email}`,
	});
});

module.exports = { sendOtp, verifyOtp };
