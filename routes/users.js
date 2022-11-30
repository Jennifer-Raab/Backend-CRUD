const express = require("express");
const { updateOrder } = require("../controllers/orders");
const user = express.Router();

const {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllOrdersofSingleUser,
  setInactive,
} = require("../controllers/users");

user.route("/").get(getAllUsers).post(createUser);

user.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

user.get("/:id/orders", getAllOrdersofSingleUser);

user.get("/:id/check-inactive", setInactive);

module.exports = user;
