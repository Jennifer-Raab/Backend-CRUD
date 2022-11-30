const pool = require("../db");

const getAllOrders = async (req, res) => {
  try {
    const data = await pool.query("SELECT * from orders");
    console.log(data.rows);
    res.status(200).json(data.rows);
  } catch (err) {
    console.log(err);
    res.send("Upps...something went wrong!");
  }
};

//Get a single order by ID

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const singleOrder = await pool.query("SELECT * FROM orders WHERE id=$1;", [
      id,
    ]);
    if (!singleOrder.rowCount) {
      return res.status(400).send(`No order with the id: ${id}`);
    }
    return res.status(200).json(singleOrder.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Upps...somthing went wrong!");
  }
};

//Create a new Order

const createOrder = async (req, res) => {
  const orderData = req.body;
  try {
    const createOrder = await pool.query(
      "INSERT INTO orders (price, user_id) VALUES ($1, $2) RETURNING *;",
      [orderData.price, orderData.user_id]
    );
    if (!orderData.price || !orderData.user_id) {
      return res
        .status(500)
        .send("Please fill out oll the Details of your Order!");
    }
    console.log(createOrder.rows);
    return res.status(200).json(createOrder.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Upps...something went wrong!");
  }
};

//Update an order

const updateOrder = async (req, res) => {
  const { id } = req.params;
  const upateData = req.body;
  if (!upateData.price || !upateData.user_id) {
    return res.status(500).send("Please fill in all the order Details!");
  }
  try {
    const updatedOrder = await pool.query(
      `UPDATE orders SET price=$1, user_id=$2 WHERE id=$3 RETURNING *;`,
      [upateData.price, upateData.user_id, id]
    );
    if (!updatedOrder.rowCount) {
      return res.status(400).send(`The id: ${id} does not exisit`);
    }
    return res.status(200).json(updatedOrder.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Upps...something went wrong");
  }
};

//delete Order

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteOrderQuery = await pool.query(
      "DELETE FROM orders WHERE id=$1 RETURNING *;",
      [id]
    );
    const [deletedOrder] = deleteOrderQuery.rows;
    if (!deleteOrderQuery.rowCount) {
      return res.status(400).send(`The id: ${id} does not exist`);
    }
    return res
      .status(201)
      .send(`The order numer: ${deletedOrder.id} was successfully deleted`);
  } catch (err) {
    console.log(err);
    return res.status(500).send("upps, something went wrong");
  }
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
