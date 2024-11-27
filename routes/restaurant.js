const express = require("express");
const router = express.Router();
const {Restaurant} = require("../schemas/restuarants.schema");

router.get("/popular", async (req, res) => {
    const response = await Restaurant.find({isPopular: true});
    if(!response) {
        return res.status(404).json({message: "Error getting restaurants"});
    }

    return res.status(200).json(response);
});

module.exports = router;