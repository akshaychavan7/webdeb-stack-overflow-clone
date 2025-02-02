const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/users");

const { SECRET_KEY } = require("../config");

const router = express.Router();


// validate crentials of the user - LOGIN
const authenticateCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 401, message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, userRole: user.userRole },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 90000000), // expires after 1 day
      })
      .status(200)
      .json({
        status: 200,
        message: "Logged In Successfully",
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          userId: user._id,
          profilePic: user.profilePic,
        },
      });
  } catch (error) {
    console.error(`Error while calling authenticate API: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, password, firstname, lastname, profilePic, location } =
      req.body;

    // check if any of the items is missing
    if (!username || !password || !firstname || !lastname || !location) {
      return res
        .status(400)
        .json({ status: 400, message: "Make sure you fill all the required fields!" });
    }

    
    // check if user already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res
        .status(400)
        .json({ status: 400, message: "User already exists" });
    } else {
       User.create({
        username,
        password,
        firstname,
        lastname,
        profilePic,
        location,
      })
      return res
        .status(200)
        .json({ status: 200, message: "User registered successfully" });
  
      }
  } catch (error) {
    console.error(`Error while calling register API: ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// add appropriate HTTP verbs and their endpoints to the router

router.post("/authenticate", authenticateCredentials);
router.post("/register", registerUser);
module.exports = router;
