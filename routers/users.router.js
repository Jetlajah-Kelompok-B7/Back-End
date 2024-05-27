const app = require("express").Router();
const { profile, notification, updateProfile, forgotPin, pinValidation } = require("../controllers/user.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/profile", restrict, profile);
app.put("/profile", restrict, updateProfile);
app.put("/profile/forgot-pin", restrict, forgotPin);
app.post("/pin-validation", restrict, pinValidation);
app.get("/notification", restrict, notification);

module.exports = app;
