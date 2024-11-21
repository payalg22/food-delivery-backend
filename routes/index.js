const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello! Welcome to food delivery app",
  });
});

module.exports = router;
