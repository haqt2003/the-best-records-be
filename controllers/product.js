const Product = require("../models/Product");

const getProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  const product = await Product.findById(productID);
  return res.status(200).json({ product });
};

const index = async (req, res, next) => {
  const products = await Product.find({});
  return res.status(200).json({ products });
};

const newProduct = async (req, res, next) => {
  const newProduct = new Product(req.value.body);
  await newProduct.save();
  return res.status(201).json({ product: newProduct });
};

const replaceProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  const newProduct = req.value.body;
  const result = await Product.findByIdAndUpdate(productID, newProduct);
  return res.status(200).json({ success: true });
};

const updateProduct = async (req, res, next) => {
  const { productID } = req.value.params;
  const newProduct = req.body;
  const result = await Product.findByIdAndUpdate(productID, newProduct);
  return res.status(200).json({ success: true });
};

module.exports = {
  getProduct,
  index,
  newProduct,
  replaceProduct,
  updateProduct,
};
