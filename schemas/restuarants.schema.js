const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const restoSchema = new Schema({
  name: String,
  city: String,
  logo: String,
  image: String,
  type: String,
  isPopular: Boolean,
});

const Restaurant = new model("Restaurant", restoSchema);

const catSchema = new Schema({
  name: String,
  img: String,
});

const Category = new model("Category", catSchema);

//TODO menu schema

module.exports = { Restaurant, Category };
