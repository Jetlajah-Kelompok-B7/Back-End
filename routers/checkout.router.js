const app = require("express").Router();
const { deleteCheckout, getCheckout, listCheckouts, confirmCheckout } = require("../controllers/checkout.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", restrict, listCheckouts);
app.post("/:id", restrict, confirmCheckout);
app.get("/:id", restrict, getCheckout);
app.delete("/:id", restrict, deleteCheckout);

module.exports = app;
