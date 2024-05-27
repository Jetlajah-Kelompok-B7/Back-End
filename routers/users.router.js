const app = require('express').Router();
const { profile, notification, updateProfile, forgotPin } = require('../controllers/profileController');
const { restrict } = require('../middlewares/middleware');

app.get('/profile', restrict, profile);
app.put('/profile', restrict, updateProfile);
app.put('/profile/forgot-pin', restrict, forgotPin);
app.get('/notification', restrict, notification);

module.exports = app;
