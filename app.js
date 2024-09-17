require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const secureApp = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// setup connect mongodb by mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/the_best_records")
  .then(() => console.log("Connected"))
  .catch((error) => console.error(`Fail ${error}`));

const app = express();
app.use(secureApp());

const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const orderRoute = require("./routes/order");

// Middlewares
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Authorization", "Content-Type"],
    exposedHeaders: ["Authorization"],
  })
);
app.use(logger("dev"));
app.use(bodyParser.json());

app.use("/products", productRoute);
app.use("/users", userRoute);
app.use("/admins", adminRoute);
app.use("/orders", orderRoute);

// Routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Server is OK!",
  });
});

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

const port = app.get("port") || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
