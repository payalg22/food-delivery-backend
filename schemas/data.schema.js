const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const locationSchema = new Schema ({
    country: {
        type: String,
        required: true,
    },
    states: {
        type: [String],
        required: true,
    },
});

const Location = new model("Location", locationSchema);

const reviewSchema = new Schema ({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
    }
});

const Review = new model("Review", reviewSchema);

module.exports = { Location, Review };