const pool = require("../db");

//Get All Users
const getAllUsers = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM users");
    if (!data.rowCount) {
      return res.status(404).send("No users found");
    }
    res.status(200).json(data.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("something went wrong");
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    if (!data.rowCount) {
      return res.status(404).send("No user with this id");
    }
    res.status(200).json(data.rows);
  } catch (err) {
    console.log(err);
  }
};

const createUser = async (req, res) => {
  console.log("Wir sind im Backend!");
  const userData = req.body;
  console.log("reqBody", userData);
  if (!userData.first_name || !userData.last_name || !userData.age) {
    return res
      .status(400)
      .send("Please fill out your firstname, lastname and age!");
  }
  try {
    const createdUser = await pool.query(
      "INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *",
      [userData.first_name, userData.last_name, userData.age]
    );
    console.log("createdUser", createdUser.rows);
    res.status(201).json(createdUser.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("something went wrong");
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  if (!updateData.first_name || !updateData.last_name || !updateData.age) {
    res.status(400).send("Please fill out your full name and age!");
  }
  try {
    const updatedUsed = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, age=$3 WHERE id=$4 RETURNING *;`,
      [updateData.first_name, updateData.last_name, updateData.age, id]
    );
    res.status(201).json(updatedUsed.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("upps, something went wrong");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await pool.query(
      "DELETE FROM users WHERE id=$1 RETURNING *;",
      [id]
    );
    const [deletedUser] = answer.rows;
    console.log("deletedUser", deletedUser.first_name);
    res.status(200).send(`User ${deletedUser.first_name} successfully deleted`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Upps, something went wrong!");
  }
};

//Get all orders of one user

const getAllOrdersofSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userOrders = await pool.query(
      "SELECT users.id AS user_id, first_name, last_name, age, active, orders.id AS order_id, price FROM users LEFT JOIN orders ON users.id = orders.user_id WHERE users.id=$1;",
      [id]
    );
    if (!userOrders.rowCount) {
      return res.status(400).send("No user with the id: ", id);
    }
    return res.status(200).json(userOrders.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Upps...something went wrong!");
  }
};

//Set users, if he has never ordered anything, inaktive

const setInactive = async (req, res) => {
  const { id } = req.params;
  try {
    const hasUserOrders = await pool.query(
      "SELECT users.id AS user_id, first_name, last_name, age, active, orders.id AS orderid, price FROM users LEFT JOIN orders ON users.id=$1;",
      [id]
    );
    console.log("hasUserOrders", hasUserOrders);
    if (!hasUserOrders.rowCount) {
      return res.status(400).send(`There is no user with the id ${id}`);
    }
    if (!hasUserOrders.rows[0].orderid) {
      console.log("Here: ", hasUserOrders.rows);
      const statusChange = await pool.query(
        "UPDATE users SET active=$1 WHERE id=$2 RETURNING *;",
        [false, id]
      );
      const [changedStatus] = statusChange.rows;
      console.log("ChangedStatus", changedStatus);
      return res.send(
        "The user has not ordered yet and will now have the status inactive"
      );
    }
    return res
      .status(200)
      .send(
        `The user ${hasUserOrders[0].first_name} has ordered before. in total ${hasUserOrders.length} times. Their status is active`
      );
  } catch (err) {
    console.log(err);
    return res.status(500).send("Upps...something went wrong!");
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  getAllOrdersofSingleUser,
  setInactive,
};
