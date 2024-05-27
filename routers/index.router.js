const app = require('express').Router();
const checkout = require('./checkout.router');
const order = require('./order.router');
const history = require('./history.router');

app.get('/', (req, res) => {
    res.status(200).json({
        status: true,
        message: "Connected",
        data: null
    });
});

app.use('/checkout', checkout);
app.use('/order', order);
app.use('/history', history);

module.exports = app;