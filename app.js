const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const app = express();

const product = require("../backend/routes/productRoutes");
const user = require("../backend/routes/userRoutes");
const order = require("../backend/routes/orderRoutes");
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use(errorMiddleware);
module.exports = app;
