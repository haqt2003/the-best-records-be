const User = require("../models/User");
const Product = require("../models/Product");

const { JWT_SECRET } = require("../configs/index");
const JWT = require("jsonwebtoken");
const { use } = require("passport");

const encodedToken = (userID) => {
  return JWT.sign(
    {
      iss: "The Best Records",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    JWT_SECRET
  );
};

const addToCart = async (req, res, next) => {
  const { userID, productID } = req.value.params;
  const user = await User.findById(userID);
  const product = await Product.findById(productID);
  const existingCartItem = user.cart.find(
    (item) => item.product.toString() === productID.toString()
  );
  if (existingCartItem) {
    existingCartItem.quantity =
      Number(existingCartItem.quantity) + Number(req.query.quantity) || 1;
  } else {
    user.cart.push({
      product: productID,
      quantity: req.query.quantity || 1,
    });
  }
  await user.save();
  return res.status(201).json({ success: true });
};

const authGoogle = async (req, res, next) => {
  const user = req.user;
  const token = encodedToken(req.user._id);
  res.setHeader("Authorization", token);
  return res.status(201).json(user);
};

const deleteUser = async (req, res, next) => {
  const { userID } = req.value.params;
  await User.findByIdAndDelete(userID);
  return res.status(200).json({ success: true });
};

const deleteUserCart = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID);
  user.cart = [];
  await user.save();
  return res.status(200).json({ success: true });
};

const deleteCartProduct = async (req, res, next) => {
  const { userID, productID } = req.value.params;
  const user = await User.findById(userID);
  user.cart.forEach((item, index) => {
    if (item.product._id.toString() === productID.toString()) {
      user.cart.splice(index, 1);
    }
  });
  await user.save();
  return res.status(200).json({ success: true });
};

const getUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID);
  return res.status(200).json({ user });
};

const getUserCart = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID).populate({
    path: "cart",
    populate: {
      path: "product",
      model: "Product",
    },
  });
  return res.status(200).json({ cart: user.cart });
};

const index = async (req, res, next) => {
  const users = await User.find({});
  return res.status(200).json(users);
};

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);
  await newUser.save();
  return res.status(201).json({ user: newUser });
};

const replaceUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const user = await User.findById(userID);
  Object.assign(user, newUser);
  await user.save();
  return res.status(200).json({ success: true });
};

const secret = async (req, res, next) => {
  return res.status(200).json({ resources: true });
};

const signIn = async (req, res, next) => {
  const { email } = req.value.body;
  const user = await User.findOne({ email });
  const token = encodedToken(req.user._id);
  res.setHeader("Authorization", token);
  return res.status(200).json(user);
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.value.body;
  const foundUser = await User.findOne({ email });
  if (foundUser && foundUser.password)
    res.status(403).json({ error: { message: "Người dùng đã tồn tại" } });
  else if (foundUser && !foundUser.password) {
    foundUser.password = password;
    await foundUser.save();
    return res.status(201).json(foundUser);
  }

  const newUser = new User({ name, email, password });
  await newUser.save();
  const token = encodedToken(newUser._id);
  res.setHeader("Authorization", token);
  return res.status(201).json(newUser);
};

const updateCartProduct = async (req, res, next) => {
  const { userID, productID } = req.value.params;
  const user = await User.findById(userID);
  user.cart.forEach((item) => {
    if (item.product._id.toString() === productID.toString()) {
      item.quantity = req.query.quantity;
    }
  });
  await user.save();
  return res.status(200).json({ success: true });
};

const updateUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const newUser = req.value.body;
  const result = await User.findByIdAndUpdate(userID, newUser);
  return res.status(200).json({ success: true });
};

module.exports = {
  addToCart,
  authGoogle,
  deleteCartProduct,
  deleteUser,
  deleteUserCart,
  getUser,
  getUserCart,
  index,
  newUser,
  replaceUser,
  secret,
  signIn,
  signUp,
  updateUser,
  updateCartProduct,
};
