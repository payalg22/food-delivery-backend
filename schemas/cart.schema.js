const mongoose = require("mongoose");
const { model, Schema, SchemaTypes } = mongoose;
const { Menu } = require("./menu.schema");
const { User, Address, Payment } = require("./user.schema");

const cartSchema = {
  user: {
    type: SchemaTypes.ObjectId,
    ref: User,
  },
  items: [
    {
      item: {
        type: SchemaTypes.ObjectId,
        ref: Menu,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  address: {
    type: SchemaTypes.ObjectId,
    ref: Address,
  },
  payment: {
    type: SchemaTypes.ObjectId,
    ref: Payment,
  },
};

const Cart = new model("Cart", cartSchema);

module.exports = { Cart };
