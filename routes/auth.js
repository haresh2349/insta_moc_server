const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { UserModel } = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const AuthRouter = Router();

AuthRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;
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
  } catch (error) {
    return res
      .status(500)
      .send({ type: "error", message: "Something went wrong" });
  }
});

AuthRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  const hash = user.password;
  try {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        return res
          .status(500)
          .send({ type: "error", message: "Please enter right credentials" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY);
      return res.status(201).send({
        type: "success",
        message: "Logged in successfully",
        token: token,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .send({ type: "error", message: "Something went wrong" });
  }
});

module.exports = { AuthRouter };
// "email":"a@gmail.com",
//   "number":12344455,
//   "full_name":"Haresh Solanki",
//   "username":"haresh007",
//   "password":"test"
