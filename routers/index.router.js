const app = require("express").Router();
const checkout = require("./checkout.router");
const order = require("./order.router");
const history = require("./history.router");
const auth = require("./auth.router");
const user = require("./user.router");
const ticket = require("./ticket.router");
const airport = require("./airport.router");

app.get("/", (req, res) => {
    const routes = {};
    ["history", "user", "checkout", "ticket"].forEach((route) => {
        routes[route] = `${req.protocol}://${req.get("host")}/api/${route}`;
    });

    return res.status(200).json({
        status: true,
        message: "Connected",
        data: routes
    });
});

app.use("/", auth);
app.use("/user", user);
app.use("/checkout", checkout);
app.use("/order", order);
app.use("/history", history);
app.use("/ticket", ticket);
app.use("/airport", airport);

module.exports = app;
