const { model, Schema } = require("mongoose");
const User = require("./user");
const Product = require("./productModel");

const orderSchema = new Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    phoneNo: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      product: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
      }
    }
  ],
  paymentInfo: {
    id: {
      type: String
    },
    status: {
      type: String
    }
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  paidAt: {
    type: Date
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing"
  },
  deliveredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const Order = model("Order", orderSchema);
module.exports = Order;
