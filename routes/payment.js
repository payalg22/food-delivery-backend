const express = require("express");
const router = express.Router();
const { User, Payment } = require("../schemas/user.schema");
const validate = require("../middleware/auth");

router.get("/", validate, async (req, res) => {
  const { user } = req;

  try {
    const allCards = await Payment.find({ user });

    if (allCards.length === 0) {
      return res.status(404).json({ message: "Cards not found" });
    }

    return res.status(200).json(allCards);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/new", validate, async (req, res) => {
  const { user } = req;
  let data = req.body;

  try {
    const card = new Payment({
      user,
      ...data,
    });

    const res = await card.save();

    return res.status(201).json(res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.put("/edit/:id", validate, async (req, res) => {
  const { id } = req.params();
  const { user } = req;
  const data = req.body;

  try {
    const isUser = await User.findById(user);
    if (!isUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let card = await Payment.findByIdAndUpdate(id, data);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    return res.status(201).json({
      message: "Changes saved",
    });

    // card = {
    //   ...card,
    //   cardnumber: data.cardnumber || card.cardnumber,
    //   expiry: data.expiry || card.expiry,
    //   cvc: data.cvc || card.cvc,
    //   name: data.name || card.name,
    // };

    // await card.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.delete("/delete/:id", validate, async (req, res) => {
  let { id } = req.params;

  try {
    var address = await Payment.findByIdAndDelete(id);
    if (!address) {
      return res.status(202).json({
        message: "Card not found",
      });
    }

    return res.status(200).json({
      message: "Card deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
