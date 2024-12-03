const mongoose = require("mongoose");
const { Schema, model, SchemaTypes } = mongoose;

const addressSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
    validate: {
      validator: (value) => String(value).length === 6,
      message: "Pincode must be 6 digits",
    },
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const paymentSchema = new Schema({
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },
  cardnumber: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  cvc: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Address",
    },
  ],
  payment: [
    {
      type: SchemaTypes.ObjectId,
      ref: "Payment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Address = new model("Address", addressSchema);
const Payment = new model("Payment", paymentSchema);
const User = new model("User", userSchema);

module.exports = { User, Address, Payment };
