const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  full_name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = new model("user", UserSchema);

module.exports = { UserModel };
