const app = require("express").Router();
const controller = require("../controllers/ticket.controller");

app.get("/", controller.getAllTickets);
app.get("/:id", controller.getTicketById);
app.post("/", controller.createTicket);
app.delete("/:id", controller.deleteTicket);

module.exports = app;
