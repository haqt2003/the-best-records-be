const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
  },
  authGoogleID: {
    type: String,
    default: null,
  },
  authType: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
  cart: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  order: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.authType !== "local") next();
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(this.password, salt);
    this.password = passwordHashed;
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
