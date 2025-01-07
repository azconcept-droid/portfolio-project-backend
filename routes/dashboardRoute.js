const restrictTo = require("../auth/acl");
const { authentication } = require("../auth/auth");
const { dashboard } = require("../controllers/dashboard");

const router = require("express").Router();

/**
 * @swagger
 * /user/dashboard:
 *   get:
 *     tags:
 *      - dashboard
 *     summary: login into user dashboard
 *     description: dashboard
 *     responses:
 *      200:
 *        description: User logged in successfully...
 */
router
  .route("/user/dashboard")
  .get(authentication, restrictTo("end_user"), dashboard);

module.exports = router;
