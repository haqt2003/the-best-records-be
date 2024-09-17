const Admin = require("../models/Admin");

const signIn = async (req, res, next) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  return res.status(200).json(admin);
};

module.exports = { signIn };
