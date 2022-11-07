const mongoose = require("mongoose");
const Customer = require("./customer");
const Product = require("./product");

const orderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  customer_id: {
    type: String,
    required: true,
  },
  Product_id: {
    type: String,
    required: true,
  },
  Product_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
