const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
//const dataRouter = require("./routes/data");
const restoRouter = require("./routes/restaurant");
const orderRouter = require("./routes/order");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
//app.use("/api/v1/data", dataRouter);
app.use("/api/v1/restaurant", restoRouter);
app.use("/api/v1/cart", orderRouter);
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    mongoose.connect(process.env.MONGOOSE_URI_STRING).then(() => {
        console.log("Connected to database");
    });
});