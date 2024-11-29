const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../schemas/user.schema");
const jwt = require("jsonwebtoken");
const validate = require("../middleware/auth");

//Register
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists. Please login.",
      });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User Created succesfully",
      email,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unexpected error occurred. Please try again",
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Invalid user or password",
      });
    }
    //hashing received password and comparing
    const hash = await bcrypt.compare(password, user.password);
    if (!hash) {
      return res.status(404).json({
        message: "Invalid user or password",
      });
    }
    //creating jwt
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unexpected error occurred. Please try again",
    });
  }
});

//User Details
router.get("/", validate, async (req, res) => {
  const { user } = req;
  try {
    //get user data
    const getUser = await User.findById(user).select("-__v -password -createdAt");
    if (!getUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(getUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unexpected error occurred. Please try again",
    });
  }
});

module.exports = router;
