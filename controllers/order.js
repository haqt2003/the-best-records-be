const { model } = require("mongoose");
const Order = require("../models/Order");

const index = async (req, res, next) => {
  const orders = await Order.find({});
  return res.status(200).json({ orders });
};

const getUserOrders = async (req, res, next) => {
  const { userID } = req.params;
  const orders = await Order.find({ owner: userID }).populate({
    path: "products",
    populate: {
      path: "product",
      model: "Product",
    },
  });
  return res.status(200).json(orders);
};

const getOrder = async (req, res, next) => {
  const { orderID } = req.params;
  const order = await Order.findById(orderID).populate({
    path: "products",
    populate: {
      path: "product",
      model: "Product",
    },
  });
  return res.status(200).json(order);
};

const newOrder = async (req, res, next) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  return res.status(201).json({ success: "true" });
};

module.exports = { index, getUserOrders, getOrder, newOrder };
