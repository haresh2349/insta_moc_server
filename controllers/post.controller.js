const { PostModel } = require("../models/PostSchema");
const { UserModel } = require("../models/UserSchema");

// To get all Posts
const getAllPosts = (req, res) => {
  let userId = req.body.userId;
  try {
    PostModel.find({})
      .populate("postedBy", "_id profilePhoto username")
      .sort("-createdAt")
      .then((posts) =>
        res.status(201).send({ type: "success", allPosts: posts })
      )
      .catch((err) =>
        res.status(500).send({ type: "error", message: "An error occured" })
      );
  } catch (e) {
    // console.log(e);
    res.status(500).json({ type: "error", message: "Something went wrong" });
  }
};

// get posts of following users

const getFollowingsPosts = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await UserModel.findOne({ _id: userId });
    PostModel.find({ postedBy: { $in: user.following } })
      .populate("postedBy", "_id username profilePhoto")
      .populate("postedBy.comments", "_id username profilePhoto")
      .then((posts) => {
        res.send(posts);
      });
  } catch (error) {
    res.json(error);
  }
};

// only users post
const getMyProfile = async (req, res) => {
  console.log("getin");
  let userId = req.body.userId;
  try {
    UserModel.findOne({ _id: userId })
      .select("-password")
      .then((user) => {
        PostModel.find({ postedBy: userId })
          .populate("postedBy", "_id username profilePhoto")
          // .populate("comments.postedBy", "_id username profilePhoto")
          .sort("-createdAt")
          .exec((err, posts) => {
            if (err) {
              return res
                .status(404)
                .json({ type: "error", message: "An error occured" });
            }
            return res.status(201).send({ user, posts });
          });
      });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ type: "error", message: "User not found" });
  }
};

// To create an post
const createPost = async (req, res) => {
  const { caption, photo } = req.body;
  try {
    const post = await new PostModel({
      caption: caption || "",
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
    PostModel.findOne({ _id: req.params.postId })
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
      req.body.postId,
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
      req.body.postId,
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
    const user = await UserModel.findOne({ _id: userId });
    const comment = {
      comment: req.body.comment,
      postedBy: {
        _id: userId,
        username: user.username,
        profilePhoto: user.profilePhoto,
      },
    };
    PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedBy", "_id username profilePhoto")
      .populate("postedBy", "_id username")
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

// search users

const searchUser = (req, res) => {
  console.log(req.params.username);
  try {
    var regex = new RegExp(req.params.username, "i");
    UserModel.find({ username: regex }).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

// See Profile of other user

const getProfile = (req, res) => {
  try {
    UserModel.findOne({ _id: req.params.id })
      .select("-password")
      .then((user) => {
        PostModel.find({ postedBy: req.params.id })
          .populate("postedBy", "_id username")
          .exec((err, posts) => {
            if (err) {
              return res
                .status(404)
                .json({ type: "error", message: "An error occured" });
            }
            return res.status(201).send({ user, posts });
          });
      });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ type: "error", message: "User not found" });
  }
};

// To follow the user

const followTheUser = (req, res) => {
  try {
    UserModel.findByIdAndUpdate(
      req.body.followId,
      {
        $push: { followers: req.body.userId },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        UserModel.findByIdAndUpdate(
          req.body.userId,
          {
            $push: { following: req.body.followId },
          },
          {
            new: true,
          }
        )
          .then((result) => res.json(result))
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    return res.status(500).send({ type: "error", message: "An error occured" });
  }
};
// To unfollow the user

const unFollowTheUser = (req, res) => {
  try {
    UserModel.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.body.userId },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        UserModel.findByIdAndUpdate(
          req.body.userId,
          {
            $pull: { following: req.body.unfollowId },
          },
          {
            new: true,
          }
        )
          .then((result) => res.json(result))
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    return res.status(500).send({ type: "error", message: "An error occured" });
  }
};

const editProfilePic = async (req, res) => {
  const { userId } = req.body;
  try {
    const result = await UserModel.updateOne(
      { _id: userId },
      {
        $set: { profilePhoto: req.body.profilePhoto },
      }
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getAllPosts,
  getMyProfile,
  createPost,
  deletePost,
  commentToPost,
  likePost,
  unLikePost,
  getProfile,
  followTheUser,
  unFollowTheUser,
  searchUser,
  editProfilePic,
  getFollowingsPosts,
};
