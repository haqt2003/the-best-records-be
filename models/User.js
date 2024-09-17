const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    phonenumber: {
      type: String,
      default: "",
    },
    address: {
      province: {
        type: String,
        default: "",
      },
      district: {
        type: String,
        default: "",
      },
      ward: {
        type: String,
        default: "",
      },
      detail: {
        type: String,
        default: "",
      },
    },
    email: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    try {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
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
