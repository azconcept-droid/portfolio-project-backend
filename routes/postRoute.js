const { authentication } = require("../auth/auth");
const { createPost, getPosts, getPostById, updatePost, deletePostById, getPostsByUserId } = require("../controllers/post");
const router = require("express").Router();

router.route("/posts").post(authentication, createPost);

router.route("/posts").get(authentication, getPosts);

router.route("/user/posts").get(authentication, getPostsByUserId);

router.route("/posts/:id").get(authentication, getPostById);

router.route("/posts/:id").put(authentication, updatePost);

router.route("/posts/:id").delete(authentication, deletePostById);

module.exports = router;
