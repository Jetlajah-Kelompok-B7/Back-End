const app = require("express").Router();
const { getHistoryTransaction, listHistoryTransactions } = require("../controllers/history_transaction.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", restrict, listHistoryTransactions);
app.get("/:id", restrict, getHistoryTransaction);

module.exports = app;
