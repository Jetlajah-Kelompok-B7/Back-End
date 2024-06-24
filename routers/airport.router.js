const app = require("express").Router();
const { getAllAirport } = require("../controllers/airport.controller");

app.get("/", getAllAirport);

module.exports = app;
