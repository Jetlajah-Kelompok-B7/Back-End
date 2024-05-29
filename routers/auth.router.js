const app = require("express").Router();
const { register, login, createPin } = require("../controllers/auth.controller");
const { restrict } = require("../middlewares/middleware");

app.post("/register", register);
app.post("/login", login);
app.post("/create-pin", createPin);

module.exports = app;
