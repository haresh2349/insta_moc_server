const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { AuthRouter } = require("./routes/auth");
const { PostsRouter } = require("./routes/posts");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRouter);
app.use("/feed", PostsRouter);

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  });
});
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Listening at port : ${PORT}`);
});
