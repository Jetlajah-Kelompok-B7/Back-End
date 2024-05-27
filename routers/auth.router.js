const app = require("express").Router();
const { register, login } = require("../controllers/authController");
const { restrict } = require("../middlewares/middleware");

app.post("/register", register);
app.post("/login", login);
// app.post('/create-pin', createPin);

module.exports = app;
