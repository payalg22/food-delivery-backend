const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = mongoose;
const { Restaurant } = require("./restuarants.schema");

const menuSchema = new Schema({
  name: String,
  restaurant: {
    type: SchemaTypes.ObjectId,
    ref: Restaurant,
  },
  price: Number,
  category: String,
  description: String,
});

const Menu = new model("Menu", menuSchema);

module.exports = { Menu };
