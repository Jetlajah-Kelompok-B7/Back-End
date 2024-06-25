const app = require("express").Router();
const controller = require("../controllers/plane.controller");

app.get("/", controller.getAllPlane);

module.exports = app;
