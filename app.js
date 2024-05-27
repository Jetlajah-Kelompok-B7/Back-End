const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const router = require('./routers/index.router');
app.use('/test', router);

app.listen(port, () => {
    console.log(`${port} is running`);
})