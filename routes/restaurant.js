const express = require("express");
const router = express.Router();
const { Restaurant, Category } = require("../schemas/restuarants.schema");
const { Menu } = require("../schemas/menu.schema");

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
    };
  };

  var restoArr = ["Pizza & Fast food", "Vegan", "Sushi", "Others"];
  restoArr = restoArr.map((item) => {
    return sortRestauarants(item);
  });

  return res.status(200).json(restoArr);
});

//get specific restaurant details
router.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Restaurant.findById(id).select("-isPopular -__v");

    if (!response) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//get Menu - for a particular restaurant
router.get("/menu/:id", async (req, res) => {
  //restaurant id
  const { id } = req.params;
  try {
    const getMenu = async (category) => {
      const response = await Menu.find({
        $and: [{ restaurant: id }, { category }],
      }).select("-__v -category -restaurant");

      return response;
    };

    const menu = {
      Combos: await getMenu("Combos"),
      Snacks: await getMenu("Snacks"),
      Breakfast: await getMenu("Breakfast"),
      Pizza: await getMenu("Pizza"),
      Fries: await getMenu("Fries"),
    };

    if (!menu) {
      return res.status(404).json({
        message: "Menu not available",
      });
    }

    return res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = router;
