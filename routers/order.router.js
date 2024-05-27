const app = require('express').Router();
const controller = require('../controllers/order.controller');

app.get('/', controller.listOrders);
app.post('/', controller.createOrder);
app.get('/:id', controller.getOrder);

module.exports = app;