const express = require("express");
const router = express.Router();
const User = require("../models/userModal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password, verifyPassword } = req.body;

    // validation

    if (!email || !password || !email) {
      return res
        .status(400)
        .json({ errorMessage: "Please Enter all required field" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ errorMessage: "Please Enter password atleast 6 char length" });
    }

    if (password !== verifyPassword) {
      return res
        .status(400)
        .json({ errorMessage: "Password and Confirm Password Do not Match!" });
    }

    // Existing User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        errorMessage: "Account already Registered with this Email Address",
      });
    }

    // Hashing the Password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // New User Account

    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    // Building token
    const token = jwt.sign({ user: savedUser._id }, process.env.JWT_SECRET);

    // Sending HTTP only token
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    res.status(500).json({ message: "Failure", errorMessage: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Please Enter all required field" });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        errorMessage: "Wrong email or Password",
      });
    }

    const passwordCorrect = bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordCorrect) {
      return res.status(401).json({
        errorMessage: "Wrong email or Password",
      });
    }

    // Building token
    const token = jwt.sign({ user: existingUser._id }, process.env.JWT_SECRET);

    // Sending HTTP only token
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (error) {
    res.status(500).json({ message: "Failure", errorMessage: error.message });
  }
});

router.get("/logout", async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

module.exports = router;
