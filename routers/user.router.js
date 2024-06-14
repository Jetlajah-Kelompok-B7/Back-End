const app = require("express").Router();
const { profile, notification, updateProfile, deleteUser, getUsers } = require("../controllers/user.controller");
const { restrict, isAdmin } = require("../middlewares/middleware");
const { upload } = require("../libs/multer");

app.get("/profile", restrict, profile);
app.put("/profile", restrict, upload.single("file"), updateProfile);
app.get("/notification", restrict, notification);

app.delete("/:id", restrict ,isAdmin, deleteUser);
app.get("/all", restrict, isAdmin, getUsers);

module.exports = app;
