"use strict"

const { login } = require("../controllers/login");

const router = require("express").Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *      - login
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
 *          password:
 *            type: string
 *          confirmPassword:
 *            type: string
 *     responses:
 *      200:
 *        description: User logged in successfully...
 */
router.route("/user/login").post(login);

module.exports = router;