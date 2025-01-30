const restrictTo = require("../auth/acl");
const { authentication } = require("../auth/auth");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePostById,
  getPostsByUserId,
  approvePosts,
} = require("../controllers/post");
const router = require("express").Router();

router.route("/posts").post(authentication, createPost);

router.route("/posts").get(authentication, getPosts);

router.route("/user/posts").get(authentication, getPostsByUserId);

router.route("/posts/:id").get(authentication, getPostById);

router.route("/posts/:id").put(authentication, updatePost);

router.route("/posts/:id").delete(authentication, deletePostById);

router
  .route("/posts/approved")
  .post(authentication, restrictTo("admin"), approvePosts);

module.exports = router;
