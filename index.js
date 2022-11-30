require("dotenv").config();
const express = require("express");
const pool = require("./db");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;

const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to my first Application, that has controllers and routes!");
});

app.use("/users", userRouter);
app.use("/orders", orderRouter);

app.listen(PORT, () => {
  console.log("listening on Port: ", PORT);
});
