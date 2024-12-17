"use strict"

const { signup } = require("../controllers/signup");

const router = require("express").Router();

/**
 * @swagger
 * /signup/talent:
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
 *          firstName:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          confirmPassword:
 *            type: string
 *          userType:
 *            type: string
 *          subscribed:
 *            type: string
 *          skills:
 *            type: string
 *          skillLevel:
 *            type: string
 *     responses:
 *      200:
 *        description: User created successfully...
 */
router.route("/user/signup").post(signup);

module.exports = router;
