const { Router } = require("express");
const { requireLogin } = require("../middleware/requireLogin");
const { PostModel } = require("../models/PostSchema");

const PostsRouter = Router();

PostsRouter.get("/allPosts", requireLogin, async (req, res) => {
  try {
    const { userId } = req.body;
    const posts = await PostModel.find({ userId });
    return res.status(200).send({ type: "success", data: posts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ type: "error", message: "Something went wrong" });
  }
});

PostsRouter.post("/upload", requireLogin, async (req, res) => {
  const { userId } = req.body;
  console.log(userId);
  try {
    const payload = new PostModel({ ...req.body });
    await payload.save();
    return res.status(201).send({ type: "success", data: payload });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ type: "error", message: "Something went wrong" });
  }
});

PostsRouter.patch("/update/:id", requireLogin, async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  try {
  } catch (error) {}
});
module.exports = { PostsRouter };
