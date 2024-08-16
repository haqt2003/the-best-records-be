const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
  },
  singer: {
    type: String,
  },
  img: {
    type: String,
  },
  song: {
    type: String,
  },
  prePrice: {
    type: String,
  },
  price: {
    type: String,
  },
  type: {
    type: String,
  },
  duration: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
