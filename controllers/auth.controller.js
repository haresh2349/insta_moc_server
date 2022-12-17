const bcrypt = require("bcryptjs");
const { UserModel } = require("../models/UserSchema");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    // console.log(user);
    if (user) {
      return res
        .status(500)
        .send({ type: "error", message: "User already exists" });
    } else {
      bcrypt.hash(password, 6, async function (err, hash) {
        if (err) {
          return res
            .status(500)
            .send({ type: "error", message: "Something went wrong" });
        }
        const newUser = new UserModel({ ...req.body, password: hash });
        await newUser.save();
        return res
          .status(201)
          .send({ type: "success", message: "Account created successfully." });
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ type: "error", message: "Something went wrong" });
  }
};
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(500).send({ type: "error", message: "User not found" });
  }
  const hash = user.password;
  try {
    bcrypt.compare(password, hash, function (err, result) {
      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY);
        return res.status(201).send({
          type: "success",
          message: "Logged in successfully",
          token: token,
        });
      } else {
        return res
          .status(500)
          .send({ type: "error", message: "Please enter right credentials" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .send({ type: "error", message: "Something went wrong" });
  }
};

module.exports = { registerUser, loginUser };
