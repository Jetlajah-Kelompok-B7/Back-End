const app = require('express').Router();
const controller = require('../controllers/history_transaction.controller');

app.get('/', controller.listHistoryTransactions);
app.get('/:id', controller.getHistoryTransaction);

module.exports = app;
