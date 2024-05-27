const express = require('express');
const router  = express.Router()
const controller = require('../controllers/history_transaction.controller');

router.get('/', controller.listHistoryTransactions);
router.get('/:id', controller.getHistoryTransaction);

module.exports = router;
