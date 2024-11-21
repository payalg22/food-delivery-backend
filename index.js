const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
dotenv.config();
const app = express();
app.use(express.json());
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    mongoose.connect(process.env.MONGOOSE_URI_STRING).then(() => {
        console.log("Connected to database");
    });
});