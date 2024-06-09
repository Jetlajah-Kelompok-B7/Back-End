require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const cors = require("cors");

const port = 3000;
const api = require("./routers/index.router");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(cors());

app.get("/", (req, res, next) => {
    try {
        return res.json({ status: true, message: "OK", data: "/api" });
    } catch (error) {
        next(error);
    }
});
app.use("/api", api);

app.use((err, req, res, next) => {
    res.status(500).json({ err: err.message });
});

app.use((req, res, next) => {
    res.status(404).json({ err: `Cannot ${req.method} ${req.url}` });
});

app.listen(port, () => {
    console.log(`running on port ${port}`);
});

module.exports = app;
