const app = require("express").Router();
const { register, login, logout, createPin, changePin, forgotPin, pinValidation, googleOAuth2, requestResetPassword, resetPassword, forgotPasswordView, resetPasswordView, changePassword, verifyEmail } = require("../controllers/auth.controller");
const { restrict, authGoogle, authGoogleCallback } = require("../middlewares/middleware");

app.get("/auth/google", authGoogle);
app.get("/auth/google/callback", authGoogleCallback, googleOAuth2);
app.post("/register", register);
app.post("/login", login);
app.post("/logout", restrict, logout);
app.post("/create-pin", restrict, createPin);
app.put("/change-pin", restrict, changePin);
app.put("/forgot-pin", restrict, forgotPin);
app.post("/pin-validation", restrict, pinValidation);
app.put("/change-password", restrict, changePassword);
app.post("/request-reset-password", requestResetPassword);
app.post("/reset-password", resetPassword);
app.get("/forgot-password", forgotPasswordView);
app.get("/reset-password", resetPasswordView);
app.get("/verify-email", verifyEmail);

module.exports = app;
