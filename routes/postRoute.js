const { authentication } = require("../auth/auth");
const { createPost, getPosts, getPostById, updatePost, deletePostById } = require("../controllers/post");
const router = require("express").Router();

router.route("/users/posts").post(authentication, createPost);

router.route("/users/posts").get(authentication, getPosts);

router.route("/users/posts/:id").get(authentication, getPostById);

router.route("/users/posts/:id").put(authentication, updatePost);

router.route("/users/posts/:id").delete(authentication, deletePostById);

module.exports = router;
