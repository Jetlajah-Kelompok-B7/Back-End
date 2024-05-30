const app = require("express").Router();
const { register, login, createPin, forgotPin, pinValidation } = require("../controllers/auth.controller");
const { restrict } = require("../middlewares/middleware");

app.post("/register", register);
app.post("/login", login);
app.post("/create-pin", createPin);
app.put("/forgot-pin", restrict, forgotPin);
app.post("/pin-validation", restrict, pinValidation);

module.exports = app;
