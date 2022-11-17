const { PostModel } = require("../models/PostSchema");

// To get all Posts
const getAllPosts = async (req, res) => {
  let userId = req.body.userId;
  try {
    PostModel.find()
      .populate("postedBy", "_id username")
      .then((posts) =>
        res.status(201).send({ type: "success", allPsts: posts })
      )
      .catch((err) =>
        res.status(500).send({ type: "error", message: "An error occured" })
      );
  } catch (e) {
    // console.log(e);
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
};

// only users post
const getMyPosts = async (req, res) => {
  let userId = req.body.userId;
  try {
    PostModel.find({ postedBy: userId })
      .populate("postedBy", "_id username")
      .then((posts) =>
        res.status(201).send({ type: "success", myPosts: posts })
      )
      .catch((err) =>
        res.status(500).send({ type: "error", message: "An error occured" })
      );
  } catch (e) {
    // console.log(e);
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
};

// To create an post
const createPost = async (req, res) => {
  const { caption, photo } = req.body;
  try {
    const post = await new PostModel({
      caption,
      photo,
      postedBy: req.body.userId,
      deleted: false,
    });
    await post.save();
    return res
      .status(201)
      .json({ type: "success", message: "post created successfully" });
  } catch (e) {
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
};

// To delete an post
const deletePost = async (req, res) => {
  try {
    PostModel.findOne({ _id: req.params.id })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(422).json({ error: err });
        }

        if (post.postedBy._id.toString() === req.body.userId.toString()) {
          post
            .remove()
            .then((result) => {
              return res.json({ message: "Successfully Deleted" });
            })
            .catch((err) => {
              return res.json({ error: err });
            });
        }
      });
  } catch (e) {
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
};

// To like post
const likePost = async (req, res) => {
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { likes: req.body.userId },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        res.status(422).send({ error: err });
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    return res.status(500).send({ type: "error", message: "An error occured" });
  }
};

// to unlike post
const unLikePost = async (req, res) => {
  try {
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.body.userId },
      },
      {
        new: true,
      }
    ).exec((err, result) => {
      if (err) {
        res.status(422).send({ error: err });
      } else {
        res.status(200).send(result);
      }
    });
  } catch (error) {
    return res.status(500).send({ type: "error", message: "An error occured" });
  }
};

// to comment on post

const commentToPost = async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = {
      comment: req.body.comment,
      postedBy: userId,
    };
    PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedBy", "_id username")
      .exec((err, result) => {
        if (err) {
          console.log(err);
          res.status(422).json({ error: err });
        } else {
          res.status(200).send(result);
        }
      });
  } catch (error) {
    return res.status(500).send({ type: "error", message: "An error occured" });
  }
};

module.exports = {
  getAllPosts,
  getMyPosts,
  createPost,
  deletePost,
  commentToPost,
  likePost,
  unLikePost,
};
