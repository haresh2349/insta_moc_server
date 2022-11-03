const jwt = require("jsonwebtoken");
require("dotenv").config();
const requireLogin = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(404)
      .send({ type: "error", message: "Please login again" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.SECRETKEY, function (err, decoded) {
    if (err) {
      return res
        .status(404)
        .send({ type: "error", message: "You are not authorised" });
    }
    const { userId } = decoded;
    console.log(decoded, "uid");
    req.body.userId = userId;
    next();
  });
};
module.exports = { requireLogin };
