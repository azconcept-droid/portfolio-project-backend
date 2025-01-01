const { sendOtp, verifyOtp } = require("../controllers/verify-email");

const router = require("express").Router();

/**
 * @swagger
 * /send-otp:
 *   post:
 *     tags:
 *      - Signup
 *     summary: Create new talent
 *     description: Create new talent who can login
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *            type: string
 *     responses:
 *      200:
 *        description: otp created successfully...
 */
router.route("/send-otp").post(sendOtp);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     tags:
 *      - Signup
 *     summary: verify otp
 *     description: Create new talent who can login
 *     requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          email:
 *            type: string
 *          token:
 *            type: string
 *     responses:
 *      200:
 *        description: otp verified successfully...
 */
router.route("/verify-otp").post(verifyOtp);

module.exports = router;
