const { getUsers, getUserById } = require("../controllers/user");

const router = require("express").Router();

router.route("/users").get(getUsers);

router.route("/users/:id").get(getUserById);

module.exports = router;
