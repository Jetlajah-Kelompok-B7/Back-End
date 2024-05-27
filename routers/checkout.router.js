const app = require("express").Router();
const { createCheckout, deleteCheckout, getCheckout, listCheckouts, updateCheckout } = require("../controllers/checkout.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", listCheckouts);
app.post("/:id", createCheckout);
app.get("/:id", getCheckout);
app.put("/:id", updateCheckout);
app.delete("/:id", deleteCheckout);

module.exports = app;
