// Application server

const rateLimit = require("express-rate-limit");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { authorization, adminAuthorization } = require("./middleware/authorization"); // custom middleware defined for user authorization

const { MONGO_URL, port, CLIENT_URL } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 300 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Apply rate limiter to all requests
app.use(limiter);

app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));

app.use(express.json());

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const loginController = require("./controller/login");
const userController = require("./controller/user");
const commentController = require("./controller/comment");
const voteController = require("./controller/vote");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/login", loginController);
// app.use("/register", loginController);
app.use("/comment", commentController);
app.use("/user", userController);
app.use("/vote", voteController);

let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

// route to check if user is authenticated
app.get("/isUserAuthenticated", authorization, (req, res) => {
  res.status(200).json({ message: "User is authenticated" });
});

app.get("/isUserModeratorAuthenticated", adminAuthorization, (req, res) => {
  res.status(200).json({ message: "User is authenticated" });
});

// Logout route
app.get("/logout", authorization, (req, res) => {
  try {
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ status: 200, message: "Successfully logged out" });
  } catch (error) {
    console.error(`Error while calling logout API: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});

module.exports = server
