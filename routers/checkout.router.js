const app = require('express').Router();
const controller = require('../controllers/checkout.controller');

app.post('/', controller.createCheckout);
app.get('/', controller.listCheckouts);
app.get('/:id', controller.getCheckout);

module.exports = app;