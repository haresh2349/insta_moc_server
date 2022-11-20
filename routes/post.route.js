const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  unLikePost,
  commentToPost,
  getMyProfile,
} = require("../controllers/post.controller");
const { requireLogin } = require("../middleware/requireLogin");

const postRoutes = express.Router();

postRoutes.get("/all", requireLogin, getAllPosts);
postRoutes.get("/myProfile", requireLogin, getMyProfile);
postRoutes.post("/upload", requireLogin, createPost);
postRoutes.post("/comment", requireLogin, commentToPost);
postRoutes.post("/like", requireLogin, likePost);
postRoutes.post("/unlike", requireLogin, unLikePost);
postRoutes.delete("/delete", requireLogin, deletePost);

module.exports = { postRoutes };
