const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  unLikePost,
  commentToPost,
  getMyProfile,
  searchUser,
  getProfile,
  followTheUser,
  unFollowTheUser,
  editProfilePic,
  getFollowingsPosts,
} = require("../controllers/post.controller");
const { requireLogin } = require("../middleware/requireLogin");

const postRoutes = express.Router();

postRoutes.get("/all", requireLogin, getAllPosts);
postRoutes.get("/followingPosts", requireLogin, getFollowingsPosts);
postRoutes.get("/myProfile", requireLogin, getMyProfile);
postRoutes.get("/Profile/:id", requireLogin, getProfile);
postRoutes.post("/upload", requireLogin, createPost);
postRoutes.post("/comment", requireLogin, commentToPost);
postRoutes.post("/like", requireLogin, likePost);
postRoutes.post("/unlike", requireLogin, unLikePost);
postRoutes.post("/follow", requireLogin, followTheUser);
postRoutes.post("/unfollow", requireLogin, unFollowTheUser);
postRoutes.delete("/delete/:postId", requireLogin, deletePost);
postRoutes.get("/search/:username", requireLogin, searchUser);
postRoutes.patch("/edit", requireLogin, editProfilePic);
module.exports = { postRoutes };
