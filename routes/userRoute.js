const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUserById,
} = require("../controllers/user");
const { authentication } = require("../auth/auth");
const router = require("express").Router();

router.route("/users").post(createUser);

router.route("/users").get(authentication, getUsers);

router.route("/users/:id").get(authentication, getUserById);

router.route("/users/:id").put(authentication, updateUser);

router.route("/users/:id").delete(authentication, deleteUserById);

module.exports = router;
