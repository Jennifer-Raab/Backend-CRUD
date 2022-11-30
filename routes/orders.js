const express = require("express");

const orders = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders");

orders.route("/").get(getAllOrders).post(createOrder);

orders.route("/:id").get(getSingleOrder).put(updateOrder).delete(deleteOrder);

module.exports = orders;
