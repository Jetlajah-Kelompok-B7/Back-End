const app = require("express").Router();
const { profile, notification, updateProfile } = require("../controllers/user.controller");
const { restrict, upload } = require("../middlewares/middleware");

app.get("/profile", restrict, profile);
app.put("/profile", restrict, upload.single('file'), updateProfile);
app.get("/notification", restrict, notification);

module.exports = app;
