const app = require("express").Router();
const { register, login, createPin, forgotPin, pinValidation, googleOAuth2, requestResetPassword, resetPassword, forgotPasswordView, resetPasswordView, verifEmail } = require("../controllers/auth.controller");
const { restrict, authGoogle, authGoogleCallback } = require("../middlewares/middleware");

app.get("/login/google", authGoogle);
app.get("/login/google/callback", authGoogleCallback, googleOAuth2);
app.post("/register", register);
app.post("/login", login);
app.post("/create-pin", restrict, createPin);
app.put("/forgot-pin", restrict, forgotPin);
app.post("/pin-validation", restrict, pinValidation);
app.post("/request-reset-password", requestResetPassword);
app.put("/reset-password", resetPassword);
app.get("/forgot-password", forgotPasswordView);
app.get("/reset-password", resetPasswordView);
app.get("/verif-email", verifEmail);

module.exports = app;
