const app = require("express").Router();
const { profile, notification, updateProfile } = require("../controllers/user.controller");
const { restrict } = require("../middlewares/middleware");
const { image } = require("../middlewares/multer")

app.get("/profile", restrict, profile);
app.put("/profile", restrict, image.single('file'), updateProfile);
app.get("/notification", restrict, notification);

module.exports = app;
