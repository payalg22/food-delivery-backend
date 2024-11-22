const express = require("express");
const router = express.Router();
const { v2: cloudinary } = require("cloudinary");

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello! Welcome to food delivery app",
  });
});

router.get("/assets", async (req, res) => {
  try {
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: "food-delivery-assets/",
    });

    const data = resources.map((resource) => resource.secure_url);

    if (!data) {
      return res.status(404).json({
        message: "No images found",
      });
    }

    return res.status(200).json({
      assets: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching images",
    });
  }
});
module.exports = router;
