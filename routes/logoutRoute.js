const { authentication } = require("../auth/auth");
const { logout } = require("../controllers/logout");

const router = require("express").Router();

router.route("/user/logout").post(authentication, logout);

module.exports = router;
