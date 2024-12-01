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

module.exports = { Location };