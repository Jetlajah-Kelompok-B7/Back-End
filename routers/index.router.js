const express = require('express');
const router  = express.Router()
const checkout = require('./checkout.router');
const order = require('./order.router');
const history = require('./history.router');
const ticket = require('./ticket.router');

router.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Connected",
        data: null
    });
});

router.use('/checkout', checkout);
router.use('/order', order);
router.use('/history', history);
router.use('/ticket', ticket);

module.exports = router