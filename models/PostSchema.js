const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        comment: String,
        postedBy: { type: ObjectId, ref: "user" },
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "user",
    },
    deleted: Boolean,
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("post", postSchema);

module.exports = { PostModel };
