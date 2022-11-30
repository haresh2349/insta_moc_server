const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRouter = require("./routes/auth.route");
const { postRoutes } = require("./routes/post.route");
require("dotenv").config();
const PORT = process.env.PORT || 8080;
const app = express();
var options = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(options));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/auth", authRouter);
app.use("/feed", postRoutes);

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
