const app = require("express").Router();
const { createCheckout, deleteCheckout, getCheckout, listCheckouts, confirmCheckout } = require("../controllers/checkout.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", restrict, listCheckouts);
app.post("/:id", restrict, createCheckout);
app.post("/:id/pay", restrict, confirmCheckout);
app.get("/:id", restrict, getCheckout);
app.delete("/:id", restrict, deleteCheckout);

module.exports = app;
