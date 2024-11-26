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

    const getImg = (search) => {
      const img = data.find((item) => {
        return item.includes(search);
      });

      return img;
    };

    const assets = {
      login: getImg("login"),
      home: {
        heroComp1: getImg("hero-comp1"),
        heroComp2: getImg("hero-comp2"),
        vectorOrder: getImg("home-vector-place-order"),
        vectorTrack: getImg("home-vector-track"),
        vectorDelivered: getImg("home-vector-delivered"),
      },
    };

    //console.log(assets);

    return res.status(200).json(assets);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching images",
    });
  }
});
module.exports = router;
