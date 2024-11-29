const express = require("express");
const router = express.Router();
const { Restaurant, Category } = require("../schemas/restuarants.schema");

//get popular restaurants
router.get("/popular", async (req, res) => {
  var response = await Restaurant.find({ isPopular: true }).select(
    "_id name logo"
  );
  if (!response) {
    return res.status(404).json({ message: "Error getting restaurants" });
  }

  return res.status(200).json(response);
});

//get food categories
router.get("/categories", async (req, res) => {
  const response = await Category.find();
  if (!response) {
    return res.status(404).json({ message: "Error getting categories" });
  }

  return res.status(200).json(response);
});

//get other restaurants
router.get("/others", async (req, res) => {
  var response = await Restaurant.find({ isPopular: false }).select(
    "-isPopular -__v"
  );
  if (!response) {
    return res.status(404).json({ message: "Error getting restaurants" });
  }

  const sortRestauarants = (type) => {
    var restaurants = response.filter((place) => {
        return place.type === type;
      });
      return {
        type,
        restaurants,
      }
  }

  var restoArr = ["Pizza & Fast food", "Vegan", "Sushi", "Others"];
  restoArr = restoArr.map((item) => {
    return sortRestauarants(item);
  })

//   const vegan = response.filter((place) => {
//     return place.type === "Vegan";
//   });

//   const sushi = response.filter((place) => {
//     return place.type === "Sushi";
//   });

//   const others = response.filter((place) => {
//     return place.type === "Others";
//   });

  

//   return res.status(200).json({
//     pizzaNFastFood,
//     vegan,
//     sushi,
//     others,
//   });

return res.status(200).json(restoArr);
});

module.exports = router;
