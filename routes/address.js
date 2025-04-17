const express = require("express");
const router = express.Router();
const { User, Address } = require("../schemas/user.schema");
const validate = require("../middleware/auth");

//new User Address
router.post("/new", validate, async (req, res) => {
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
        address: response,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
  
  //Update Address
  router.put("/edit", validate, async (req, res) => {
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
  
  //set default address
  router.put("/default/:id", validate, async (req, res) => {
    let { id } = req.params;
    const { user } = req;
  
    try {
      var address = await Address.findById(id);
      if (!address) {
        return res.status(202).json({
          message: "Address not found",
        });
      }
  
      var allAddresses = await Address.find({ user });
      allAddresses.forEach(async (addr) => {
        if (addr._id.toString() === id) {
          addr.isDefault = true;
        } else {
          addr.isDefault = false;
        }
        await addr.save();
      });
  
      return res.status(200).json({
        message: "Address Updated",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
  
  //Delete addresss
  router.delete("/delete/:id", validate, async (req, res) => {
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
        message: "Address deleted",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  });
  
  module.exports = router;