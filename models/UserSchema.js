const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    followers: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: "user",
      },
    ],
    profilePhoto: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("user", userSchema);

module.exports = { UserModel };
