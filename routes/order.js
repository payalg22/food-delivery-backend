const express = require("express");
const router = express.Router();
const { Cart } = require("../schemas/cart.schema");
const validate = require("../middleware/auth");
const { Address } = require("../schemas/user.schema");

//Add item to cart
router.post("/add/:itemid", validate, async (req, res) => {
  const { itemid } = req.params;
  const { user } = req;

  var cart = await Cart.findOne({ user });

  if (cart) {
    const itemIndex = cart.items.findIndex((it) => {
      return it.item.toString() === itemid.toString();
    });
    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ item: itemid, quantity: 1 });
    }

    let response = await cart.save();
    return res.status(201).json(response);
  }

  const addr = await Address.findOne({ user }).where({ isDefault: true });
  cart = new Cart({
    user,
    items: [{ item: itemid }],
    address: addr ? addr._id : null,
  });

  const response = await cart.save();

  return res.status(201).json(response);
});

//TODO: select payment method route
router.put("/payment/:id", validate, async (req, res) => {
  const { id } = req.params();
  const { user } = req;
  const cardId = new mongoose.Types.ObjectId(`${id}`);

  try {
    const cart = await Cart.findOneAndUpdate(
      { user },
      { payment: cardId },
      { new: true }
    );

    return res.status(204);
  } catch (error) {}
});

//TODO: select address route
router.put("/address/:id", validate, async (req, res) => {
  const { id } = req.params();
  const { user } = req;
  const addrId = new mongoose.Types.ObjectId(`${id}`);

  try {
    const cart = await Cart.findOneAndUpdate(
      { user },
      { address: addrId },
      { new: true }
    );

    return res.status(204);
  } catch (error) {}
});

//Get cart for user
router.get("/", validate, async (req, res) => {
  const { user } = req;

  const response = await Cart.findOne({ user }).select("-__v -user").populate({
    path: "items.item",
    select: "name price img",
  });

  if (!response) {
    return res.status(404).json({
      message: "Cart is empty",
    });
  }

  return res.status(200).json(response);
});

//delete item from cart
router.delete("/delete/:itemid", validate, async (req, res) => {
  const { itemid } = req.params;
  const { user } = req;

  var cart = await Cart.findOne({ user });

  if (!cart) {
    return res.status(404).json({ message: "Cart is empty" });
  }
  const itemIndex = cart.items.findIndex((it) => {
    return it.item.toString() === itemid.toString();
  });
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }

  const quan = cart.items[itemIndex].quantity;
  if (quan > 1) {
    cart.items[itemIndex].quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }
  const response = await cart.save();
  return res.status(204).json(response);
});

//clearing cart after placing order
router.delete("/clear", validate, async (req, res) => {
  const { user } = req;

  var cart = await Cart.findOne({ user });
  if (cart) {
    cart.items = [];
  }
  const response = await cart.save();
  return res.status(201).json(response);
});

module.exports = router;
