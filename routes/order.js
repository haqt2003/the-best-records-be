const express = require("express");
const router = require("express-promise-router")();

const OrderController = require("../controllers/order");

router.route("/").get(OrderController.index).post(OrderController.newOrder);

router.route("/:userID").get(OrderController.getUserOrders);

router.route("/:userID/:orderID").get(OrderController.getOrder);

module.exports = router;
