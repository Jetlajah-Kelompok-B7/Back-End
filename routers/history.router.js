const app = require("express").Router();
const { createHistoryTransaction, deleteHistoryTransaction, getHistoryTransaction, listHistoryTransactions, updateHistoryTransaction } = require("../controllers/history_transaction.controller");
const { restrict } = require("../middlewares/middleware");

app.get("/", listHistoryTransactions);
app.get("/:id", getHistoryTransaction);

module.exports = app;
