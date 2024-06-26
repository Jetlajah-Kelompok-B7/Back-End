const app = require("express").Router();
const { deleteCheckout, getCheckout, listCheckouts, confirmCheckout, printCheckout } = require("../controllers/checkout.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", restrict, listCheckouts);
app.post("/:id/print", restrict, printCheckout);
app.post("/:id", restrict, confirmCheckout);
app.get("/:id", restrict, getCheckout);
app.delete("/:id", restrict, deleteCheckout);

module.exports = app;
