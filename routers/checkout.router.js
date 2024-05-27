const express = require('express');
const router  = express.Router()
const controller = require('../controllers/checkout.controller');

router.post('/', controller.createCheckout);
router.get('/', controller.listCheckouts);
router.get('/:id', controller.getCheckout);

module.exports = router;