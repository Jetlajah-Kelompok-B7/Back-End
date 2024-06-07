const app = require("express").Router();
const { createOrder, getOrder, deleteOrder, listOrders, updateOrder } = require("../controllers/order.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", restrict, listOrders);
app.post("/:id", restrict, createOrder);
app.get("/:id", restrict, getOrder);
app.put("/:id", restrict, updateOrder);
app.delete("/:id", restrict, deleteOrder);

module.exports = app;
