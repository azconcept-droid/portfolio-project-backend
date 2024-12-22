const { sendOtp, verifyOtp } = require("../controllers/verify-email");

const router = require("express").Router();

router.route("/send-otp").post(sendOtp);

router.route("/verify-otp").post(verifyOtp);

module.exports = router;
