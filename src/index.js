const express = require('express');
const dotenv = require('dotenv');

const { initDatabase, initApp } = require('./server');
const router = require('./routers');
const getLogger = require('./utils/logger');
const logger = getLogger(__filename);

dotenv.config();

initDatabase();

const app = express();
const port = process.env.PORT;
const host = '0.0.0.0';

initApp(app);

app.use('/api', router);

app.listen(port, host, () => {
    logger.info(`App listening on port ${port}`)
})