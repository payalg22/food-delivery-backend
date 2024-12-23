const express = require("express");
const router = express.Router();
const { v2: cloudinary } = require("cloudinary");
const { Location, Review } = require("../schemas/data.schema");

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello! Welcome to food delivery app",
  });
});

//Get assets
router.get("/assets", async (req, res) => {
  try {
    let nextCursor = null;
    const allResources = [];

    do {
      const { resources, next_cursor } = await cloudinary.api.resources({
        type: "upload",
        prefix: "food-delivery-assets/",
        resource_type: "image",
        max_results: 500,
        next_cursor: nextCursor,
      });
      allResources.push(...resources);
      nextCursor = next_cursor;
    } while (nextCursor);

    const data = allResources.map((resource) => resource.secure_url);
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
        chef: getImg("home-chef"),
        rider: getImg("home-rider"),
        ad: getImg("home-advertisement"),
      },
      coupons: {
        freeIcecream: getImg("free-icecream"),
        firstOrder: getImg("first-order"),
        veganDiscount: getImg("vegan-discount"),
      }
    };

    //console.log(assets);

    return res.status(200).json(assets);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching assets" });
  }
});

//Get State list
router.get("/states", async (req, res) => {
  const list = await Location.findOne({ country: "India" }).select("-_id -__v");

  if (!list) {
    return res.status(404).json({ message: "Data not found" });
  }

  return res.status(200).json(list);
});

//Get Reviews
router.get("/reviews", async (req, res) => {
  const list = await Review.find().select("-_id -__v");

  if (!list) {
    return res.status(404).json({ message: "Data not found" });
  }

  return res.status(200).json(list);
});

module.exports = router;
