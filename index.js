const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { AuthRouter } = require("./routes/auth");
const { PostsRouter } = require("./routes/posts");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
console.log("XYZ");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get("/", (req, res) => {
  return res.send("WELCOME");
});
app.use("/auth", AuthRouter);
app.use("/feed", PostsRouter);
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Listening at port : ${PORT}`);
});
