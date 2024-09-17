const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
    },
    phonenumber: {
      type: String,
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
    note: {
      type: String,
      default: "",
    },
    total: {
      type: String,
    },
    shippingStatus: {
      type: String,
      default: "Delivering",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
