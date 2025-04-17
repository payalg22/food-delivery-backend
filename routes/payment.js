const express = require("express");
const router = express.Router();
const { User, Payment } = require("../schemas/user.schema");
const validate = require("../middleware/auth");

