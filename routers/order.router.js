const app = require("express").Router();
const { createOrder, getOrder, deleteOrder, listOrders, updateOrder } = require("../controllers/order.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", listOrders);
app.post("/", createOrder);
app.get("/:id", getOrder);

module.exports = app;
