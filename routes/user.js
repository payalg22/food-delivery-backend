const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Address } = require("../schemas/user.schema");
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
    const getUser = await User.findById(user)
      .select("-__v -password -createdAt")
      .populate("address");
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

//Update User Details
router.put("/edit", validate, async (req, res) => {
  const { user } = req;
  let data = req.body;
  console.log(data);
  try {
    let userInfo = await User.findById(user).select(
      "-password -createdAt -__v"
    );
    if (!userInfo) {
      return res.status(404).json({ messsage: "User not found" });
    }

    if (userInfo._id.toString() !== data._id.toString()) {
      return res.status(400).json({ messsage: "Can't update user" });
    }

    userInfo = await User.findByIdAndUpdate(user, data, { new: true }).select(
      "-password -createdAt -__v"
    );
    res.status(201).json(userInfo);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Unexpected error occurred. Please try again",
    });
  }
});

//new User Address
router.post("/address/new", validate, async (req, res) => {
  const { user } = req;
  let data = req.body;

  try {
    var userInfo = await User.findById(user);

    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const isDefault = userInfo?.address?.length === 0 ? true : false;
    const address = new Address({
      user,
      ...data,
      isDefault,
    });
    const response = await address.save();
    userInfo.address = [...userInfo.address, response._id];
    await userInfo.save();

    res.status(201).json({
      message: "Address Saved",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//Update Address
router.put("/address/edit", validate, async (req, res) => {
  let data = req.body;

  try {
    var address = await Address.findByIdAndUpdate(data._id, data);

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(201).json({
      message: "Address Updated",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

router.delete("/address/delete/:id", validate, async (req, res) => {
  let { id } = req.params;
  const { user } = req;

  try {
    var address = await Address.findByIdAndDelete(id);
    if (!address) {
      return res.status(202).json({
        message: "Address not found",
      });
    }
    await User.findByIdAndUpdate(user, {
      $pull: { address: id },
    });

    return res.status(200).json({
      message: "Address Deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;
