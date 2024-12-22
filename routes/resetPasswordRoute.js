const { forgotPassword, resetPassword } = require("../controllers/resetPassword");

const router = require("express").Router();

/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     tags:
 *      - User
 *     summary: Update user password
 *     description: Update user password
 *     security:
 *       - Authorization: []
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
 *        description:
 *      400:
 *        description:
 */
router.route("/user/forgot-password").post(forgotPassword);

/**
 * @swagger
 * /user/reset-password:
 *   post:
 *     tags:
 *      - User
 *     summary: Reset password
 *     description: Reset password
 *     requestBody:
 *      required: false
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          token:
 *            type: string
 *          newPassword:
 *            type: string
 *          confirmNewPassword:
 *            type: string
 *     responses:
 *      200:
 *        description:
 *      400:
 *        description:
 *
 */
router.route("/user/reset-password").post(resetPassword);

module.exports = router;
