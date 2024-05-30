const app = require("express").Router();
const { profile, notification, updateProfile } = require("../controllers/user.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/profile", restrict, profile);
app.put("/profile", restrict, updateProfile);
app.get("/notification", restrict, notification);

module.exports = app;
